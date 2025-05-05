import axios from 'axios';
import React, { useActionState, useContext, useEffect, useInsertionEffect, useState } from 'react'

const handleSubmit = (params, formvalue) => {
    return formvalue.get("searching")
}

const Search = () => {

    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [finalHTML, setFinalHtml] = useState([])

    useEffect(() => {
        if (pending || !formValue) return;
        try {
            let URL = `http://localhost:3002/scrap/search`;
            axios.post(URL, { formData: formValue }).then(val => setFinalHtml(val.data));
        } catch (err) {
            console.log(err);
        }
    }, [formValue])

    console.log(finalHTML);

    return (
        <div>
            <form action={submit}>
                <input type="search" name="searching" id="searching" placeholder='Seach anything' />
                <input type="submit" value="submit" />
            </form>

            <main>
                <section>
                    <a href={finalHTML.name} target='_blank'>{finalHTML.name}</a>
                </section>

                {finalHTML?.data?.map((val) => {
                   return  val.paragraphs.lengths > 0 && <section>
                        <h3>{val.heading}</h3>
                        {val?.paragraphs?.map((paraValue) => {
                            return <p>{paraValue}</p>
                        })}
                    </section>
                })}
            </main>
        </div>
    )
}

export default Search