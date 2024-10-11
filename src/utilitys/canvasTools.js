export function centerLocator(object){
    return {x: object.x + object.width/2, y: object.y + object.height/2}
}
export function distance(object_1, object_2){
    return Math.pow(Math.pow(object_1.x-object_2.x,2)+Math.pow(object_1.y-object_2.y,2),0.5) 
}