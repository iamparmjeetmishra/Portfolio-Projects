import { z } from 'zod'


const FormZod = () => {

    const schema = z.object({
        firstName
    })

    return (
        <>
            <form>
                <label>First Name</label>    

            </form>
        </>
    )
}

export default FormZod  