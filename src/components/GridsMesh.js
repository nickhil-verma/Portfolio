import React from 'react'

const GridsMesh = () => {
  return (
    <>
        <div className="relative w-full h-full p-4">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2">
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            className="border border-black dark:border-white bg-transparent 
            bg-opacity-70 dark:bg-opacity-70"
            style={{
              background: "linear-gradient(to center, transparent, rgba(255,255,255,0.3))",
            }}
          ></div>
        ))}
      </div>
    </div>
    </>
  )
}

export default GridsMesh