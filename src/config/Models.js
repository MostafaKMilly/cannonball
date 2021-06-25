import * as THREE from 'three'

export const loadModels =(scene , gltfLoader) => {
gltfLoader.load('models/tree/scene.gltf', (gltfModel) => {
    gltfModel.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    gltfModel.scene.children[0].scale.set(10, 10, 10)
    let treeRight
    for (let i = 600; i >= -600; i -= 300) {
        if (i == 0) {
            i = 100
        }
        treeRight = gltfModel.scene.children[0].clone()
        treeRight.position.z += i
        scene.add(treeRight)
    }

    let treeLeft
    for (let i = 600; i >= -600; i -= 300) {
        if (i == 0) {
            i = 100
        }
        treeLeft = gltfModel.scene.children[0].clone()
        treeLeft.position.z += i
        treeLeft.position.x += -200
        scene.add(treeLeft)
    }
})


gltfLoader.load('models/rock/scene.gltf', (gltfModel) => {
    gltfModel.scene.scale.set(15, 15, 15)
    gltfModel.scene.position.y = 2
    for (let i = 0; i < 50; i++) {
        const subTree = gltfModel.scene.clone()
        subTree.position.x = (Math.random() - 0.5) * 1200
        subTree.position.z = (Math.random() - 0.5) * 1300
        scene.add(subTree)
    }
})
gltfLoader.load('models/plants/scene.gltf', (gltfModel) => {
    gltfModel.scene.scale.set(1.5 ,1.5, 1.5 )
    for (let i = 0; i < 130; i++) {
        const plants = gltfModel.scene.clone()
        plants.position.x = (Math.random() - 0.5) * 1300
        if (plants.position.x >-220 && plants.position.x <270) continue 
        plants.position.z = (Math.random() - 0.5) * 1300
        plants.rotation.y = Math.random() * Math.PI
        scene.add(plants)
    }
})



gltfLoader.load('models/fens/scene.gltf', (gltfModel) => {
    gltfModel.scene.scale.set(15, 15, 15)
    gltfModel.scene.position.set(-70, 4, 40)
    gltfModel.scene.rotation.y = Math.PI * 0.5

    gltfModel.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    let fens;

    for (let i = -18; i < 18; i++) {
        fens = gltfModel.scene.clone()
        fens.position.z = fens.position.z * i
        scene.add(fens)
    }
    gltfModel.scene.position.set(270, 4, 40)
    gltfModel.scene.rotation.y = Math.PI * 0.5

    let fens2;

    for (let i = -18; i < 18; i++) {
        fens2 = gltfModel.scene.clone()
        fens2.position.z = fens2.position.z * i
        scene.add(fens2)
    }

    gltfModel.scene.rotation.y = Math.PI
    gltfModel.scene.position.set(43 , 5 , -800)
    let fens3;
    for (let i = -6; i < 6; i++) {
        fens3 = gltfModel.scene.clone()
        fens3.position.x += i * 25 
        scene.add(fens3)
    }
    
})

let houses = []
gltfLoader.load('models/house/scene.gltf', (gltfModel) => {
    gltfModel.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    gltfModel.scene.children[0].scale.set(10, 10, 10)
    gltfModel.scene.children[0].position.set(100, 0, 0)
    gltfModel.scene.children[0].rotation.z = -Math.PI / 2
    let hosueOne
    for (let i = 430; i >= -430; i -= 430) {
        hosueOne = gltfModel.scene.children[0].clone()
        hosueOne.position.z += i
        houses.push(hosueOne)
        scene.add(hosueOne)
        
    }
    gltfModel.scene.children[0].position.set(-100, 0, 0)
    gltfModel.scene.children[0].rotation.z = -Math.PI / 2
    let hosueTwo;
    for (let i = 430; i >= -430; i -= 430) {
        hosueTwo = gltfModel.scene.children[0].clone()
        hosueTwo.position.z += i
        houses.push(hosueTwo)
        scene.add(hosueTwo)
    }
})

gltfLoader.load('models/box/scene.gltf', (gltfModel) => {
    gltfModel.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    gltfModel.scene.children[0].scale.set(10, 10, 10)
    gltfModel.scene.children[0].position.set(100, 11, 0)

    let boxRight;
    for (let i = 520; i > -520; i -= 260) {
        if (i === 0) {
            i = -100
        }
        boxRight = gltfModel.scene.children[0].clone()
        boxRight.position.z += i
        scene.add(boxRight)
    }
    gltfModel.scene.children[0].position.set(-100, 11, 0)

    let boxLeft;
    for (let i = 520; i > -520; i -= 260) {
        if (i === 0) {
            i = -100
        }
        boxLeft = gltfModel.scene.children[0].clone()
        boxLeft.position.z += i
        scene.add(boxLeft)
    }
})
/* const targets = []
 */
/* 
gltfLoader.load('models/target/scene.gltf', (gltfModel) => {
    
    const targetOne = gltfModel.scene.clone()
    targetOne.position.set(-30, 10, 480)
    targetOne.scale.set(10,10, 10)
    targets.push(targetOne)
    scene.add(targetOne)
   
    const targetTow = gltfModel.scene.clone()
    targetTow.position.set(30, 10, 480)
    targetTow.scale.set(10,10, 10)
    targets.push(targetTow)
    scene.add(targetTow)

    const targetThree = gltfModel.scene.clone()
    targetThree.position.set(0, 10, 480)
    targetThree.scale.set(10,10, 10)
    targets.push(targetThree)
    scene.add(targetThree)

})
 */

return {houses}

}