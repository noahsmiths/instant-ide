import express from 'express';
import { buildImages, createNewContainer } from './docker';
import config from './config';

const app = express();
const port = 8080;

// await createNewContainer('mcr.microsoft.com/devcontainers/base:jammy', 'testing123');
// await buildImages(config.images);
await createNewContainer("", "");