const { expect } = require('chai');
const rewire = require('rewire');

let logger = require('../dist/index').default;

describe('index.js', () => {
  let oldStdoutWrite;

  describe('Log functions', () => {
    const logs = [];

    before(() => {
      oldStdoutWrite = process.stdout.write;

      process.stdout.write = function stubStdout(string) {
        try {
          const parsedString = JSON.parse(string);
          logs.push(parsedString);
        } catch (e) {
          oldStdoutWrite.apply(process.stdout, [string]);
        }
      };
      logger = rewire('../dist/index').default;
    });

    after(() => {
      process.stdout.write = oldStdoutWrite;
    });

    it('should output the fatal level message', () => {
      logger.fatal('hello');
      let message = logs.shift();
      expect(message.name).to.be.eql('dev-logger');
      expect(message.msg).to.be.eql('hello');
      expect(message.level).to.be.eql(60);

      // Should keep the object safe:
      logger.fatal(
        {
          a: 1,
        },
        'hello',
      );
      message = logs.shift();

      expect(message.a).to.be.eql(1);

      // Should use the Error object for the stack:
      logger.fatal(new Error('Fatal error'), 'hello');
      message = logs.shift();

      expect(message).to.be.an('object').with.property('stack');
      expect(message.stack.substr(0, 18)).to.be.eql('Error: Fatal error');
    });

    it('should output the error level message', () => {
      logger.error('hello');
      let message = logs.shift();
      expect(message.level).to.be.eql(50);

      // Should keep the object safe:
      logger.error(
        {
          a: 1,
        },
        'hello',
      );
      message = logs.shift();

      expect(message.a).to.be.eql(1);

      // Should use the Error object for the stack:
      logger.error(new Error('Fatal error'), 'hello');
      message = logs.shift();

      expect(message).to.be.an('object');
      expect(message.stack.substr(0, 18)).to.be.eql('Error: Fatal error');
    });

    it('should output the warn level message', () => {
      logger.warn('hello');
      const message = logs.shift();
      expect(message).to.have.property('level', 40);
      expect(message).to.not.have.property('stack');
    });

    it('should output the info level message', () => {
      logger.info('hello');
      const message = logs.shift();
      expect(message).to.have.property('level', 30);
    });

    it('should not output the trace level message (level set to debug)', () => {
      logger.trace('hello');
      expect(logs).to.have.lengthOf(0);
    });

    it('should format message correctly', () => {
      logger.info('hello %s', 20);
      const message = logs.shift();
      expect(message.msg).to.be.eql('hello 20');
    });

    it('should keep objects safe', () => {
      logger.info(
        {
          a: 1,
          b: {
            c: 1,
          },
        },
        'hello',
      );
      const message = logs.shift();
      expect(message.a).to.be.eql(1);
      expect(message.b).to.be.eql({
        c: 1,
      });
      expect(message.msg).to.be.eql('hello');
    });
  });
});
