/////////////////////////
//     new api key     //
/////////////////////////

const generateAPIKey = () => {
    // characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // result
    let result = '';

    // fill 10 places for api key
    for (let i = 0; i < 10; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    };

    // return result
    return result;
};



module.exports = { generateAPIKey };