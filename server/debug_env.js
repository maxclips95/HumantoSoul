const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

console.log('Testing .env access at:', envPath);

try {
    // 1. Read
    console.log('Attempting to read...');
    let envContent = fs.readFileSync(envPath, 'utf8');
    console.log('Read success. Length:', envContent.length);

    // 2. Dummy Modify
    console.log('Attempting to modify content in memory...');
    const newHash = '$2b$12$06lkVhmPJo66BPK29zCI5.KP7g8Yqm/TESTING/Lkrx7paI4bLqunY.';

    if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
        envContent = envContent.replace(
            /ADMIN_PASSWORD_HASH=.*/,
            `ADMIN_PASSWORD_HASH=${newHash}`
        );
    } else {
        envContent += `\nADMIN_PASSWORD_HASH=${newHash}`;
    }

    // 3. Write
    console.log('Attempting to write back...');
    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('Write success!');

    // 4. Revert (Important!)
    console.log('Reverting changes...');
    envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/,
        `ADMIN_PASSWORD_HASH=$2b$12$06lkVhmPJo66BPK29zCI5.KP7g8Yqm/3jDye/Lkrx7paI4bLqunY.`
    );
    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('Revert success!');

} catch (err) {
    console.error('ERROR:', err);
}
