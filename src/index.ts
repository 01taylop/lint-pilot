#!/usr/bin/env node
import { ProcessSupervisor } from 'process-supervisor'

import { createProgram } from './program'

const supervisor = new ProcessSupervisor()

const program = createProgram({
  supervisor,
})

program.parseAsync(process.argv)
