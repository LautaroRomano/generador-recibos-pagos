# Sistema de Pagos

Un sistema para gestionar clientes y recibos de pago, con autenticación de administradores.

## Primeros Pasos

1. Instalar dependencias:

```bash
npm install
# o
yarn install
```

2. Configurar la base de datos:

```bash
npx prisma migrate dev
```

3. Crear un administrador inicial:

```bash
npm run create-admin
# o
yarn create-admin
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Funcionalidades

- **Gestión de clientes**: Administración de información de clientes.
- **Recibos de pago**: Generación y gestión de recibos.
- **Autenticación**: Sistema de login para administradores.
- **Gestión de administradores**: Crear y gestionar usuarios administradores.

## Autenticación

El sistema utiliza un sistema de autenticación basado en cookies HTTP-only para la seguridad. Las credenciales del administrador predeterminado son:

- **Email**: admin@example.com
- **Contraseña**: admin123

Se recomienda cambiar estas credenciales después del primer inicio de sesión.

## Tecnologías

- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Licencia

MIT
