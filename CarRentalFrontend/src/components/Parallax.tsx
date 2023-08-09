const Parallax = () => {
    return (
        <div
            className="grid grid-cols-3 grid-rows-2 md:grid-rows-1 items-end h-screen mb-12 bg-fixed bg-center bg-cover
            bg-[url(https://thumbs.dreamstime.com/b/young-woman-car-rental-front-garage-cars-background-129337774.jpg)]"
        >
            <img className="col-span-2 row-start-2 -mb-6" src="https://activecarrental.co.za/wp-content/uploads/2022/05/header-polo-grande.png" />
            <div className="mockup-phone m-4 col-start-3 row-start-2">
                <div className="camera"></div>
                <div className="display">
                    <div className="artboard artboard-demo phone-1 bg-center bg-contain bg-[url(https://play-lh.googleusercontent.com/wOZDf7kAvLxbM94btZhVGo6LUn3BX9tpdIv3Qin3x97cLWe6w-xZSQpDydrpV6l8TUrz)]"></div>
                </div>
            </div>
        </div>
    )
}

export default Parallax