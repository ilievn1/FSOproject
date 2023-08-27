const Parallax = () => {
    return (
        <div
            className="flex items-end w-full h-screen mb-12 bg-fixed bg-center bg-cover relative overflow-x-clip
            bg-[url(https://thumbs.dreamstime.com/b/young-woman-car-rental-front-garage-cars-background-129337774.jpg)]"
        >
            <img className="absolute max-w-full -bottom-8 md:max-w-xl md:-start-16 lg:max-w-[70%]" src="https://activecarrental.co.za/wp-content/uploads/2022/05/header-polo-grande.png" />
            <div className="mockup-phone hidden absolute w-full mb-4 max-w-xs end-4 md:inline-block ">
                <div className="block camera"></div>
                <div className="block display">
                    <div style={{ width: 'auto' }} className="artboard artboard-demo phone-1 bg-center bg-contain bg-[url(https://play-lh.googleusercontent.com/wOZDf7kAvLxbM94btZhVGo6LUn3BX9tpdIv3Qin3x97cLWe6w-xZSQpDydrpV6l8TUrz)]"></div>
                </div>
            </div>
        </div>
        
    )
}

export default Parallax