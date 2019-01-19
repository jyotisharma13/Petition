const checkProfile = (age, city, url) => {

    let userProfile = {};
    if (url !== '' && !(url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'))) {
        let adress = 'http://';
        userProfile.url = adress.concat(url);
    } else if (url !== '') {
        userProfile.url = url;
    }
    if (age) {

        userProfile.age = age;
    }
    if (city) {

        userProfile.city = city.toLowerCase();

    }
    return userProfile;
};

module.exports = {  checkProfile };
