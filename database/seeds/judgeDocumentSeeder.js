import Judge from '../../app/models/judge';

/**
 * Register the new records and send this to seed
 * @param {function} seeder Function to seeded the records to the db
 */
async function boot(seeder) {
    const judges = [];
    judges.push({
        name: 'Uva Online Judge',
        url: 'https://uva.onlinejudge.org'
    });
    judges.push({
        name: 'Caribbean Online Judge',
        url: 'https://coj.uci.cu/index.xhtml'
    });

    await seeder(Judge, judges);
}

module.exports = boot;
