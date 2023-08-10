const Parallax = () => {
    return (
        <div
            className="flex items-end w-full h-screen mb-12 bg-fixed bg-center bg-cover
            bg-[url(https://thumbs.dreamstime.com/b/young-woman-car-rental-front-garage-cars-background-129337774.jpg)]"
        >
            <div className="w-2/3">

                <img className="absolute -bottom-32 right-64 md:right-96" src="https://activecarrental.co.za/wp-content/uploads/2022/05/header-polo-grande.png" />
            </div>
            <div className="mockup-phone m-4 w-1/2 h-1/2 md:h-2/3 sm:w-1/3">
                <div className="block camera"></div>
                <div className="block display">
                    <div style={{ width: 'auto' }} className="artboard artboard-demo phone-1 bg-center bg-contain bg-[url(https://play-lh.googleusercontent.com/wOZDf7kAvLxbM94btZhVGo6LUn3BX9tpdIv3Qin3x97cLWe6w-xZSQpDydrpV6l8TUrz)]"></div>
                </div>
            </div>
        </div>
    )
}

export default Parallax