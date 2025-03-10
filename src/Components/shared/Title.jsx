const Title = ({children}) => {
    return(
        <div className="w-full">
            <h1 className="text-center
            md:text-3xl sm:text-2xl text-xl bg-primary-500 text-white py-3">{children}</h1>
        </div>
    )
}

export default Title;