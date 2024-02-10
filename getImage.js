require('dotenv').config();




async function query(input) {

    const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
        headers: { Authorization: `Bearer ${process.env.HUGGING_FACE}` },
        method: "POST",
        body: JSON.stringify({"inputs": input})
    }
    );


    const result_buffer = await response.arrayBuffer()
   


    const response_upload = await fetch(
        "https://api.imgbb.com/1/upload",
        {
            headers: {},
            method: "POST",
            body: JSON.stringify({
                key: process.env.IMG,
                image:result_buffer

            })
        }

    );

    console.log(response_upload)

    const image_destination = response_upload.data.url;
    console.log(image_destination)


   

    return image_destination;

}


query("Create an image of an alpaca")

