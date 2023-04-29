import {FastifyInstance} from 'fastify';
import { createGroupHandler } from './group.controller';

async function groupRoutes(server: FastifyInstance) {
  server.post("/new", createGroupHandler);
}

export default groupRoutes;
