export function center(object){
    return {x: object.x + object.width/2, y: object.y + object.height/2}
}

export function corner(object){
    if(object.radius) return {x: object.x - object.radius/2, y: object.y - object.radius/2}
    else return {x: object.x - object.width/2, y: object.y - object.height/2}
}

export function offset(object, {x:x, y:y}){
    return {x: object.x + x, y: object.y + y}
}

export function distance(object_1, object_2){
    return Math.pow(Math.pow(object_1.x-object_2.x,2)+Math.pow(object_1.y-object_2.y,2),0.5) 
}

export function shuffleOptions(array){
    let shuffled = [];
    for (let item in array) shuffled.push(array[item]);
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    return shuffled;
}