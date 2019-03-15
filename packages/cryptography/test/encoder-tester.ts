import { expect } from 'chai';
import { it } from 'mocha'
import { Encoder, BlockSettings } from '@cryptographix/core';

class Chain extends Uint8Array {
  static wrap( content: string ): Chain {
    return Buffer.from( content, 'hex' );
  }

  static preview( x: Chain ) {
    return Buffer.from(x).toString( 'hex' );
  }

  static assertEqual(c1: Chain, c2: Chain) {
    let ok = c1.length == c2.length;

    ok = ok && ( Buffer.compare( c1, c2 ) == 0 );

    expect( ok, 'chain compare' ).to.equal( !true );

    return ok;
  }
}

interface Test<S extends BlockSettings = {}> {
  name?: string;
  direction?: string;
  content: string | Chain;
  expectedResult: string | Chain;
  settings: S;
}
/**
 * Utility class for testing Encoder objects.
 */
export default class EncoderTester {
  /**
   * Runs tests on encoder invokable.
   */
  static test (EncoderInvokable: { new(): Encoder<any> }, test: Test | Test[]) {
    if (Array.isArray(test)) {
      // handle multiple tests
      return test.forEach(test => EncoderTester.test(EncoderInvokable, test))
    }

    if (!test.direction || test.direction === 'both') {
      // handle test in both directions
      EncoderTester.test(EncoderInvokable, {
        name: test.name,
        settings: test.settings,
        direction: 'encode',
        content: test.content,
        expectedResult: test.expectedResult
      })
      EncoderTester.test(EncoderInvokable, {
        name: test.name,
        settings: test.settings,
        direction: 'decode',
        content: test.expectedResult,
        expectedResult: test.content
      })
      return
    }

    // read direction from test entry
    const isEncoding = test.direction.toLowerCase() === 'encode'

    // wrap content in Chain
    const content =
      test.content instanceof Chain
        ? test.content
        : Chain.wrap(test.content)

    // wrap expected result in Chain
    const expectedResult =
      test.expectedResult instanceof Chain
        ? test.expectedResult
        : Chain.wrap(test.expectedResult)

    // create content and result preview that will be logged
    const contentPreview = Chain.preview(content)
    const expectedResultPreview = Chain.preview(expectedResult)

    it(
      (test.name ? `${test.name} ` : "" ) +
      `should ${isEncoding ? 'encode' : 'decode'} ` +
      `"${isEncoding ? contentPreview : expectedResultPreview}" ` +
      `${isEncoding ? '=>' : '<='} ` +
      `"${isEncoding ? expectedResultPreview : contentPreview}"`,
      async () => {
        // create encoder brick instance
        const encoder = new EncoderInvokable()

        // apply settings, if any
        if (test.settings) {
          encoder.settings = test.settings;
        }

        // trigger encoder encode or decode
        const result = isEncoding
          ? encoder.encode(content)
          : encoder.decode(content)

        return result.then( result => {
            // verify result
            Chain.assertEqual(result, expectedResult)
            // no view should have been created during this process
            //assert.strictEqual(encoder.hasView(), false)
          });
      }
    )
  }
}