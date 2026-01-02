# Database Migrations Guide

## Overview

This project uses Sequelize migrations for database schema management. In test environments, the database is automatically synchronized for convenience.

## Environment Behavior

- **Test Environment**: Automatic `sync({ alter: true })` with seeding
- **Development/Production**: Manual migrations required

## Migration Commands

### Run Pending Migrations
npm run migrate

### Rollback Last Migration
npm run migrate:undo

### Rollback All Migrations
npm run migrate:undo:all

### Run Seeders
npm run seed

### Undo Last Seeder
npm run seed:undo

### Undo All Seeders
npm run seed:undo:all

## Creating New Migrations

### Generate a New Migration
npx sequelize-cli migration:generate --name describe-your-change

This creates a timestamped file in `src/migrations/`. Edit the file to define:
- `up`: Changes to apply
- `down`: How to rollback changes

### Example Migration Structure
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('teammates', 'department', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('teammates', 'department');
  }
};

## Creating New Seeders

### Generate a New Seeder
npx sequelize-cli seed:generate --name describe-your-seed-data

This creates a timestamped file in `src/seeders/`.

## Initial Setup
When deploying to production for the first time:

1. **Run migrations**:
   npm run migrate

2. **Seed initial data**:
   npm run seed

## Best Practices

1. **Never modify existing migrations** - Always create new ones
2. **Test migrations locally** before deploying
3. **Always provide a `down` method** for rollbacks
4. **Keep migrations atomic** - One logical change per migration
5. **Backup database** before running migrations in production

## Migration Files

### Initial Schema
- `20251229000000-create-initial-schema.js` - Creates all base tables (teammates, categories, questions, reviews, answers)

### Seeders
- `20251229000001-seed-categories-questions.js` - Seeds initial categories and questions

## Troubleshooting

### Migration Already Executed
If a migration was already run, Sequelize tracks it in the `SequelizeMeta` table. To re-run:
npm run migrate:undo
npm run migrate

### Check Migration Status
npx sequelize-cli db:migrate:status

### Reset Database (Development Only)
npm run migrate:undo:all
npm run seed:undo:all
npm run migrate
npm run seed

## Configuration

Database configuration is located in:
- `src/config/config.js` - Sequelize CLI config
- `.sequelizerc` - Paths for migrations, seeders, models
- `src/config/database.ts` - Application database connection
