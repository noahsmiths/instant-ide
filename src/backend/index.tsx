import express from 'express';
import { createNewContainer } from './ide_harness';

const app = express();
const port = 8080;

await createNewContainer('mcr.microsoft.com/devcontainers/base:jammy', 'testing123');