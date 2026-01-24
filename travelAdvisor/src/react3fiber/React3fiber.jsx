
// import { useRef } from 'react'
// import "./React3fiber.css"
// import {Canvas, useFrame} from "@react-three/fiber"
// // import { BoxGeometry } from 'three'


// export const cube=({position,size,color})=>{
//   const ref = useRef()
//   useFrame((state, delta) => {
//     ref.current.rotation.x += 0.01;
//     ref.current.rotation.y += 0.01;
//   });
//   return(
//      <mesh position={position} ref={ref}>
//   <boxGeometry args={size}/>
//   <meshStandardMaterial color={color}/>
//    </mesh>
//   )
// }

// const react3fiber = () => {


//   return (
//   <><div className='w-screen h-screen bg-slate-600' >
//   <Canvas>
//     <directionalLight position={[0,0,2]} intensity={1} />
//     <ambientLight intensity={1} />
//     <cube position={[0,0,0]} size={[1,1,1]} color={"orange"}/>
//  {/* { cube}
//    <mesh position={[2,0,1]}>
//   <boxGeometry/>
//   <meshStandardMaterial color={"orange"}/>
//    </mesh> */}
//     {/* <mesh position={[-4,0,1]}>
//   <boxGeometry/>
//   <meshStandardMaterial color={"orange"}/>
//    </mesh> */}

//   </Canvas>
//   </div>
//   </>
//   )
// }

// export default react3fiber
import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {MeshWobbleMaterial, OrbitControls} from "@react-three/drei"
import "./React3fiber.css"
import { MeshStandardMaterial } from "three"

const Cube = ({ position, size, color }) => {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.07
     ref.current.rotation.y += 0.05
    ref.current.position.z =Math.sin(state.clock.elapsedTime)*2
  })

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} colorWrite/>
    </mesh>
  )
}

const Sphere=({position,size})=>{
  const ref=useRef()
  const [hover,sethover]=useState(false)
  useFrame((state)=>{
    if(!ref.current)return
        ref.current.rotation.x+=0.05
        ref.current.rotation.y+=0.05
        ref.current.rotation.z+=0.05
        ref.current.position.z =Math.sin(state.clock.elapsedTime)*3
        ref.current.position.y =Math.sin(state.clock.elapsedTime)*2
        ref.current.position.x =Math.sin(state.clock.elapsedTime)*1
      
    
  })
  return(
  <mesh position={position} ref={ref} onPointerEnter={(event)=>{event.stopPropagation(),sethover(true)}}
  onPointerLeave={()=>{sethover(false)}}>
    <sphereGeometry args={size}/>
    <meshStandardMaterial color={hover ? "skyblue" : "lightgreen"} wireframe/>
  </mesh>
  )
}
const Sphere2=({position,size})=>{
  const ref=useRef()
  const [hover,sethover]=useState(false)
  const [onclick,setonclick]=useState(false);
  useFrame(()=>{
    if(!ref.current)
      
      return
     const speed =hover ? 0.05 :0.01
        ref.current.rotation.y+=speed
      
      
      
    
  })
  return(
  <mesh position={position} ref={ref} onPointerEnter={(event)=>(event.stopPropagation(),sethover(true))}
  onPointerLeave={()=>sethover(false)}
  onClick={()=>setonclick(!onclick)}
  scale={onclick ? 1.4 :1}>
    <sphereGeometry args={size}/>
    <meshStandardMaterial color={hover?"skyblue":"gray"} wireframe/>
  </mesh>
  )
}

const TorusGeometry=({position,size,color})=>{
  const ref=useRef();

  useFrame(()=>{
    if(!ref.current)return
    ref.current.rotation.x+=0.05
    ref.current.rotation.y+=0.02
    ref.current.rotation.z+=0.02
  })

  return(
     <mesh position={position} ref={ref}>
      <torusGeometry args={size}/>    
      <meshStandardMaterial color={color} wireframe/>
      {/* <MeshWobbleMaterial/> */}
     </mesh>
  )
}
const Torus=({position,size,color})=>{
  const ref=useRef();

  useFrame((state,delta)=>{
    if(!ref.current)return
    ref.current.rotation.x+=delta
    ref.current.rotation.y+=delta *2
    ref.current.position.z =Math.sin(state.clock.elapsedTime)*2
  })

  return(
     <mesh position={position} ref={ref}>
      <torusKnotGeometry args={size}/>    
      <meshStandardMaterial color={color} wireframe/>
      <MeshWobbleMaterial factor={0} speed={20}/>
     
     </mesh>
  )
}

const React3Fiber = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} /> 
        <directionalLight position={[2, 2, 5]} intensity={1} />

        {/* <Cube
          position={[0, 0, 0]}
          size={[-1, 1, 1]}
          color="orange"
        />
        <Cube
          position={[0, 0, 0]}
          size={[-1, -1, 1]}
          color="orange"
        />
        <Cube
          position={[0.1, 0, 0]}
          size={[-1, -1, -1]}
          color="orange"
        /> */}
        <Sphere position={[-2,0,1]} color={"yellow"} size={[2,60,30]}/>
        <Sphere2 position={[-1,-3,-1]} color={"yellow"} size={[30,30,30]}/>
        {/* <TorusGeometry position={[5,0,0]} size={[2,0.3,30,100]} color="red"/> */}
        {/* <Torus position={[-5,0,0]} size={[1.3,0.2,64,8,2,3]} color={  "blue" }/> */}
       <OrbitControls  />
      </Canvas>
    </div>
  )
}

export default React3Fiber
