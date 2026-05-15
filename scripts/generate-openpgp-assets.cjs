const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const workspaceRoot = process.cwd();
const sourceKeyPath = path.join(workspaceRoot, 'src', 'assets', 'unoptimized', 'public.asc');
const publicKeyOutputPath = path.join(workspaceRoot, 'public', 'keys', 'public.asc');
const generatedModulePath = path.join(
  workspaceRoot,
  'src',
  'app',
  'generated',
  'openpgp-key.generated.ts',
);

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function readAsciiArmoredKey(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing OpenPGP public key file at ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function decodeArmoredKey(armoredKey) {
  const base64Lines = armoredKey
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith('-----BEGIN ') &&
        !line.startsWith('-----END ') &&
        !line.includes(':') &&
        !line.startsWith('='),
    );

  if (base64Lines.length === 0) {
    throw new Error('OpenPGP public key armor did not contain any base64 payload.');
  }

  return Buffer.from(base64Lines.join(''), 'base64');
}

function parsePacketLength(buffer, offset, newFormat, lengthType) {
  if (newFormat) {
    const firstLengthOctet = buffer[offset];
    if (firstLengthOctet < 192) {
      return { headerLength: 1, packetLength: firstLengthOctet };
    }

    if (firstLengthOctet < 224) {
      const secondLengthOctet = buffer[offset + 1];
      const packetLength = ((firstLengthOctet - 192) << 8) + secondLengthOctet + 192;
      return { headerLength: 2, packetLength };
    }

    if (firstLengthOctet === 255) {
      return {
        headerLength: 5,
        packetLength: buffer.readUInt32BE(offset + 1),
      };
    }

    throw new Error('OpenPGP partial body lengths are not supported by this generator.');
  }

  if (lengthType === 0) {
    return { headerLength: 1, packetLength: buffer[offset] };
  }

  if (lengthType === 1) {
    return { headerLength: 2, packetLength: buffer.readUInt16BE(offset) };
  }

  if (lengthType === 2) {
    return { headerLength: 4, packetLength: buffer.readUInt32BE(offset) };
  }

  return { headerLength: 0, packetLength: buffer.length - offset };
}

function readPackets(buffer) {
  const packets = [];
  let offset = 0;

  while (offset < buffer.length) {
    const headerOctet = buffer[offset];
    if ((headerOctet & 0x80) === 0) {
      throw new Error(`Invalid OpenPGP packet header at byte offset ${offset}.`);
    }

    offset += 1;

    const newFormat = (headerOctet & 0x40) !== 0;
    const tag = newFormat ? headerOctet & 0x3f : (headerOctet >> 2) & 0x0f;
    const lengthType = headerOctet & 0x03;
    const { headerLength, packetLength } = parsePacketLength(buffer, offset, newFormat, lengthType);

    offset += headerLength;
    const body = buffer.subarray(offset, offset + packetLength);
    packets.push({ tag, body });
    offset += packetLength;
  }

  return packets;
}

function calculateFingerprintFromPacket(publicKeyPacketBody) {
  const version = publicKeyPacketBody[0];

  if (version === 4) {
    const lengthBytes = Buffer.alloc(2);
    lengthBytes.writeUInt16BE(publicKeyPacketBody.length, 0);
    return crypto
      .createHash('sha1')
      .update(Buffer.concat([Buffer.from([0x99]), lengthBytes, publicKeyPacketBody]))
      .digest('hex')
      .toUpperCase();
  }

  if (version === 5 || version === 6) {
    const lengthBytes = Buffer.alloc(4);
    lengthBytes.writeUInt32BE(publicKeyPacketBody.length, 0);
    return crypto
      .createHash('sha256')
      .update(Buffer.concat([Buffer.from([0x9a]), lengthBytes, publicKeyPacketBody]))
      .digest('hex')
      .toUpperCase();
  }

  throw new Error(`Unsupported OpenPGP public key version ${version}.`);
}

function formatFingerprint(fingerprint) {
  return fingerprint.match(/.{1,4}/gu)?.join(' ') ?? fingerprint;
}

function buildGeneratedModule(assetPath, fingerprint) {
  return [
    'export const openPgpKey = {',
    `  assetPath: '${assetPath}',`,
    `  fingerprint: '${fingerprint}',`,
    `  formattedFingerprint: '${formatFingerprint(fingerprint)}',`,
    '} as const;',
    '',
  ].join('\n');
}

function run() {
  const armoredKey = readAsciiArmoredKey(sourceKeyPath);
  const binaryKey = decodeArmoredKey(armoredKey);
  const packets = readPackets(binaryKey);
  const publicKeyPacket = packets.find((packet) => packet.tag === 6);

  if (!publicKeyPacket) {
    throw new Error('Could not find a public-key packet in the provided OpenPGP key.');
  }

  const fingerprint = calculateFingerprintFromPacket(publicKeyPacket.body);

  ensureDirectory(path.dirname(publicKeyOutputPath));
  ensureDirectory(path.dirname(generatedModulePath));

  fs.copyFileSync(sourceKeyPath, publicKeyOutputPath);
  fs.writeFileSync(
    generatedModulePath,
    buildGeneratedModule('/keys/public.asc', fingerprint),
    'utf8',
  );

  console.log(`Copied ${path.relative(workspaceRoot, publicKeyOutputPath)}`);
  console.log(`Generated ${path.relative(workspaceRoot, generatedModulePath)}`);
  console.log(`OpenPGP fingerprint: ${formatFingerprint(fingerprint)}`);
}

run();
