#!/usr/bin/env node
import { exitHandler } from './exitHandler'
import { createProgram } from './program'

process.on('exit', () => console.log())
process.on('SIGINT', () => exitHandler(0, 'SIGINT'))
process.on('SIGTERM', () => exitHandler(0, 'SIGTERM'))
process.on('uncaughtException', reason => exitHandler(1, 'Unexpected Error', reason))
process.on('unhandledRejection', reason => exitHandler(1, 'Unhandled Promise', reason))

const program = createProgram()

program.parseAsync(process.argv)
