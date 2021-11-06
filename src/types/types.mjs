import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

function fetchBase() {
    fetch('https://raw.githubusercontent.com/souris-dev/ippts-simul-backend/main/common/src/types/basetypes.ts')
        .then(function (result) {
            return result.text()
        })
        .then(function (result) {
            writeFileSync('src/types/basetypes.d.ts', result)
        })
        .catch(function (error) {
            console.log(error.message)
        });
}

function fetchInit() {
    fetch('https://raw.githubusercontent.com/souris-dev/ippts-simul-backend/main/common/src/types/inittypes.ts')
        .then(function (result) {
            return result.text()
        })
        .then(function (result) {
            writeFileSync('src/types/inittypes.d.ts', result)
        })
        .catch(function (error) {
            console.log(error.message)
        });
}

fetchBase();
fetchInit();