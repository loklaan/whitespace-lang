#!/usr/bin/env node

const toPromise = require('util').promisify
const readFile = toPromise(require('fs').readFile)
const makeCli = require('meow')
const getStdin = require('get-stdin')

const ws = require('./lib/ws-core')

const cli = makeCli(`
  Usage

    $ whitespace [source-file]

  Examples

    $ whitespace print-hello-world.ws
    $ cat print-hello-world.ws | whitespace
		
    Prints:
    $ Hello World!
`);

const srcFile = cli.input[0]
if (srcFile) {
	readFile(srcFile, 'utf-8')
		.catch(() => {
			console.error('Could not read file:', srcFile)
			cli.showHelp(1)
		})
		.then(runProgram)
} else {
	const failedStdin = () => {
		cli.showHelp(1)
	}
	getStdin()
		.catch(failedStdin)
		.then(str => {
			if (!str) failedStdin()
			else runProgram(str)
		})
}

function runProgram (src) {
  try {
    const program = ws.compile(src)
    const env = ws.env()
    env.print = str => process.stdout.write(str)
    env.runProgram(program)
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
