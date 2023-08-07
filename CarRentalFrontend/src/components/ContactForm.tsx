const ContactForm = () => {
    return (
        <form onSubmit={() => { }} >
            <h1>Contact Us!</h1>
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">What is your name?</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </div>
                <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">What is your name?</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </div>
                <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">What is your name?</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </div>
        </form>
    )
}

export default ContactForm