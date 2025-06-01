#!/usr/bin/env node
import { exitHandler } from './exit-handler'
import { createProgram } from './program'

process.on('exit', () => console.log())
process.on('SIGINT', () => exitHandler(0, 'SIGINT'))
process.on('SIGTERM', () => exitHandler(0, 'SIGTERM'))
process.on('uncaughtException', error => exitHandler(1, 'Unexpected Error', error))
process.on('unhandledRejection', error => exitHandler(1, 'Unhandled Promise', error))

const program = createProgram()

program.parseAsync(process.argv)
