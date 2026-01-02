'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if categories already exist
    const [categories] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM categories'
    );
    
    if (categories[0].count > 0) {
      console.log('Categories already seeded, skipping...');
      return;
    }

    // Insert categories
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Communication',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Technical Skills',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teamwork',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Problem Solving',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Get category IDs
    const [categoryRows] = await queryInterface.sequelize.query(
      'SELECT id, name FROM categories ORDER BY id'
    );

    const categoryMap = categoryRows.reduce((acc, row) => {
      acc[row.name] = row.id;
      return acc;
    }, {});

    // Insert questions
    await queryInterface.bulkInsert('questions', [
      // Communication questions
      {
        questionText: 'Does the teammate communicate clearly and effectively?',
        categoryId: categoryMap['Communication'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate actively listen to others?',
        categoryId: categoryMap['Communication'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate provide timely updates?',
        categoryId: categoryMap['Communication'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Technical Skills questions
      {
        questionText: 'Does the teammate demonstrate strong technical abilities?',
        categoryId: categoryMap['Technical Skills'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate write clean and maintainable code?',
        categoryId: categoryMap['Technical Skills'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate stay current with technology trends?',
        categoryId: categoryMap['Technical Skills'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Teamwork questions
      {
        questionText: 'Does the teammate collaborate well with others?',
        categoryId: categoryMap['Teamwork'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate support team members?',
        categoryId: categoryMap['Teamwork'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate contribute to team morale?',
        categoryId: categoryMap['Teamwork'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Problem Solving questions
      {
        questionText: 'Does the teammate approach problems analytically?',
        categoryId: categoryMap['Problem Solving'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate find creative solutions?',
        categoryId: categoryMap['Problem Solving'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionText: 'Does the teammate handle challenges effectively?',
        categoryId: categoryMap['Problem Solving'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Seed data inserted successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};
