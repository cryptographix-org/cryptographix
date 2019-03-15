import { ByteArray, Block, BlockSettings } from '@cryptographix/core';
import { RSAEncryptor, IRSAKey } from '@cryptographix/cryptography';

//import { forge, Bytes } from "./node-forge";

export class EMVRootKey {
  constructor( public rid: ByteArray, public index: number, public modulus: ByteArray, public exponent: ByteArray ) {
  }
}

let rootKeys: EMVRootKey[] = [
  new EMVRootKey( ByteArray.fromString("a000000154",'hex'), 0x01,
ByteArray.fromString("\
BCC0C02F309EF3123B2F44FCF6230E472AA9C12468EC96D244C4B72DDE7DD33BC494D3618D51420E9DE719CBB27B83A3A7D8D544899B02679FBB9DAD945A49E9CE3CDFD053F364110A1AC01AED6CD0C0C128BB02D35FDE51C566371D0FF1AB04D570F6F9EBD70B12B3B0BE06DE0A9CFE3A38CC0D70420D3B6400E8A6F1F3C0BFD24CB083EC89B42616A841334BA3D440F38166D642E40398321593B568BE0F2C0AC705897F77D80FF4294A5C4C244026E8ECC3F70B77DFED1A8B362432E37257099BECE324D40FF694B433D8F8A7A403D0A8FBCE28915D7CDE49A30E074D9BCA1D020390E5653EDEC104BD7B82847BD5212864E8D89E1F3B",'hex'), ByteArray.fromString("\x01\x00\x01")),
  new EMVRootKey( ByteArray.fromString("a000000154",'hex'), 0x02, ByteArray.fromString("\
CCB8BC1F9F8284C7AC81800C6BD61C9ED613524754A0A3736AD60BAF0428C9A1A48E747CF39768D740E641E7E828AE724AEE92F733C9DDAE88954F3F688757A512291861CC66408016C9000191A875982A25E63EF59E0102A3C78020AEC432BD9DBBE746492147D4C27D35C89A4B3D9C782F30474C8B6E0AB7C1F4701EA083AA64F98FBAD3193D0600413FEE9F5C1FFAC586431DBB4A646B58D4F120828A97A7053EDE24C76C87BAAB4AF6A224D5E984652D46E58DFBE60E705207FD29DF7864914473F6DD88EED0EC1538993BD606EED1D7328E9FFC0A3CCECDDA7A155C5BD524AFA7ED10259238FE42DDE203591FB17539D1FBBBEA5735\
",'hex'), ByteArray.fromString("\x01\x00\x01")),

]

export class EMVCertificateDecoder {
  constructor() {

  }

  async decodeIssuerCertificate( rid: ByteArray, index: number, issuerCert: ByteArray ): Promise<object> {
    let decoded: any = { failed: true };

    let rootKey = rootKeys.find( (k:EMVRootKey) => {
      return ( ByteArray.compare( k.rid, rid ) == 0 ) && ( k.index == index );
    });

    if ( rootKey ) {
      let key: IRSAKey = {
        algorithm: { name: 'RSA-NOPAD' },
        extractable: true,
        type: 'public',
        usages: [],
        data: {
          e: rootKey.exponent,
          n: rootKey.modulus,
        }
      }

      let plain = await new RSAEncryptor( key ).decrypt( issuerCert );
      let plainLen = plain.length;

      let modulusLen = plain[ 13 ];
      let exponentLen = plain[ 14 ];

      let modLeftLen = plainLen - 36;
      let modPad = (modulusLen < modLeftLen ) ? modLeftLen - modulusLen : 0;

      decoded = {
        header: plain[0],
        format: plain[1],
        bin: plain.slice( 2, 2+4 ),
        expiry: plain.slice( 6, 6+2 ),
        serial: plain.slice( 8, 8+3 ),
        hashAlgorithm: plain[11],
        pkAlgorithm: plain[12],
        modulusLen,
        exponentLen,
        modulus: plain.slice( 15, 15+modLeftLen - modPad ),
//        exponent: plain.substr(15 + modLeftLen, expLen),
        hash: plain.slice( plainLen-21, plainLen-1 ),
        trailer: plain[ plainLen-1 ],
        __plain: plain
      }
    }
    else {
      console.log( "ERROR: Root Key not found ");
    }

    return decoded;
  }

}
/*
let cert = forge.util.hexToBytes( `
 9E 77 19 A5 0E 28 7E D1 07 14 FF 3E 45 01 E8 59 54 42 58 DE
 9E A7 3D A0 90 16 D3 C0 3F AD 9E E6 B1 DD EB 9E CD 58 D4 39
 01 30 B8 47 31 EF 03 0A 2F 5E 79 1D 88 4B 95 55 9F 26 20 36
 21 9C 28 89 4E AF 75 CD C5 98 C6 20 64 A5 C5 BA E0 14 9A 90
 F7 27 D7 45 8A 58 84 31 01 81 72 B9 5E 93 25 75 BF 84 B3 09
 3C 83 FF 7A 93 74 7A F5 62 63 FB 20 0C A6 9D AB 61 CD DB 58
 57 19 0A A8 F5 85 DB 90 2E 24 63 2D 0B 32 52 6A 62 C2 5E FD
 03 F5 E6 E2 1D 90 64 F4 82 8D 9C 49 61 5B AC 17 B2 8F 6A A3
 0E C0 B1 84 B4 2F 9B 72 17 EC DE 68 24 C2 80 61 38 BE 62 61
 E9 C3 54 7E 28 CB D0 98 9A 0F 18 88 4B C3 B4 1A EF BF 69 5F
 26 F7 30 67 B0 E7 40 31 CE D2 41 10 36 C5 A9 4A 0E C4 BE D4
 23 09 4C 84 25 F5 7E C0 A1 F5 8F 3D B4 A4 68 44 9C 83 03 08
 B1 56 2A FE AA 3F 06 E7
`.replace( /[ \s]/g,''));

cert = forge.util.hexToBytes('1605A34D4D0CCF8B78DC8BA2BD26A871680A2BE0865319C55BB0F8DA793AF8E8114A401981FA1BC91E66B068050C7285E381F44D4117EA8E9BE9ADC329B2F3954D1B77D1137AF9AE3FD81E894D7A32D936587114EE82F44675B748EEE1DE907A59BFFE64B23DB263AAF7FB91F75B142BF192E6791E38F069C54C98F10AEB291E1C32D141B5079B790C502A0038146DDB7E37D341590B5193422B07BCF5A5BC68F6B970532D7C37872BA5EF5FCC7992B8B391C01AE9CD3209BD72CCD8CB77199C3D298FDA1A235F35309750EF2FD3E5D7EA525AB82E53A7FA147D622165BC8BE97FEEF84D134B38CD3B7E04FD80DB9391EA180094C7B0E4ED');

let decoded = new EMVCertificateDecoder().decodeIssuerCertificate("\xA0\x00\x00\x01\x54", 0x02, cert);
for( let m in decoded ) {
  console.log( m + ":" + forge.util.bytesToHex( decoded[m] ) );
}*/

/*9F0700004AB809F0D00010FC5064A0009F0E0001004008800009F0F00010F87064F8009F140000109F2300001000CA0001200000000000000CB00012000000000000DF7100014A0000001545344DF770000207DF3000032A00000015444420000639664FF210201DF3100032A00000015453440000639664FF210201DF3200032A00000015444420000639664FF5A05010090004961605A34D4D0CCF8B78DC8BA2BD26A871680A2BE0865319C55BB0F8DA793AF8E8114A401981FA1BC91E66B068050C7285E381F44D4117EA8E9BE9ADC329B2F3954D1B77D1137AF9AE3FD81E894D7A32D936587114EE82F44675B748EEE1DE907A59BFFE64B23DB263AAF7FB91F75B142BF192E6791E38F069C54C98F10AEB291E1C32D141B5079B790C502A0038146DDB7E37D341590B5193422B07BCF5A5BC68F6B970532D7C37872BA5EF5FCC7992B8B391C01AE9CD3209BD72CCD8CB77199C3D298FDA1A235F35309750EF2FD3E5D7EA525AB82E53A7FA147D622165BC8BE97FEEF84D134B38CD3B7E04FD80DB9391EA180094C7B0E4ED008F00002029F320000601000100C3000080000080000C400008010E500A00C500008030FF00A00920000000E001124E119DF4104A0010000DF460700D50400000002DF460500D6020000E133DF4104A0020000DF460A00C802007600C9020986DF460300CA06DF4302CA06DF460300CB06DF4302CB06DF42069F14019F2301E128DF4104A0030000DF460300C304DF4302C304DF460300C404DF4302C404DF460300C504DF4302C504E11EDF4104A0040000DF471400C607000000000000009F360200009F13020000E141DF410415027700DF47379F2701009F360200009F10200FA002000000000000000000000000000F0000000000000000000000000000009F26080000000000000000E118DF410415017700DF470E8202390094080801040010010101E12ADF410401017000DF420557105F2020DF470A5F280200769F42020986DF42035F3002DF47059F08022000E147DF410401027000DF471A8C189F02069F03069F1A0295055F2A029A039C019F37049F3501DF470B8D0991088A029F37049505DF47128E1000000000000000004403410342030000E10CDF410401037000DF42029000E12CDF410401047000DF42039F4700DF47069F49039F3704DF44039F4800DF44039F4600DF42078F019F32009200E121DF410402017000DF42175F25035F24035A085F34019F07029F0D059F0E059F0F05E111DF410415030000DF46077781849F4B8180E10DDF410480000000DF43039F7E10E10DDF410480200000DF43039F7F08E10DDF410481AE0000DF43039F7B00E10DDF410481AF0000DF43039F7C00E10DDF410490200000DF4303DF7100E107DF4104903000009F4700006010001*/

type Hash = { [index: string]: string };

function parseCTV( ctv: string ): Hash {
  let ret:Hash = {};
  let pos = 0;

  while( pos + 9 <= ctv.length ) {
    let tag = ctv.substr( pos, 4 );
    let len = parseInt( ctv.substr(pos+4,5));

    ret[tag] = ctv.substr(pos+9,len);

    pos += 4 + 5 + len;
  }

  return ret;
}

function parseTLV( tlv: string ): Hash {
  let ret:Hash = {};
  let pos = 0;

  while( pos + 4 <= tlv.length ) {
    let tag = tlv.substr( pos, 2 );

    pos+=2;
    if ( tag == '00')
      continue;

    if ( "13579BDF".indexOf(tag[0]) >= 0 && ( tag[1]=='F')) {
      tag += tlv.substr( pos, 2 );
      pos+=2;
    }

    let lenHex = tlv.substr( pos, 2 );
    pos+=2;
    if ( lenHex == "81")
    {
      lenHex = tlv.substr( pos, 2 );
      pos+=2;
    }

    let len = parseInt( lenHex, 16 );

    ret[tag] = tlv.substr(pos,len*2);

    pos += len * 2;
  }

  return ret;
}

export function H2B(h: string): ByteArray { return ByteArray.fromString( NOWS(h), 'hex'); }
export function NOWS( s: string ): string { return s.replace( /[ \s]/g,''); }