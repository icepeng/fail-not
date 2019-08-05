import { Connection, createConnection, EntityManager } from 'typeorm';

export interface TypeormService {
  connection: Connection;
  entityManager: EntityManager;
}

async function TypeormServiceFactory(): Promise<TypeormService> {
  const connection = await createConnection();

  return {
    connection,
    entityManager: connection.manager,
  };
}

export const TypeormService = TypeormServiceFactory();
