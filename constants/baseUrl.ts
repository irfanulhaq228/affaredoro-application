// export const baseUrl= 'http://192.168.154.50:8000'
// export const baseUrl= 'http://192.168.0.106:8000' 
// export const baseUrl= 'https://test-backend.affaredoro.com'
export const baseUrl= 'https://backend.affaredoro.com'
export const stripe_public_key= 'pk_test_51RH3dwI5tAyGjw2REiKEXU1UjR8QfdvJZyY1SOcxZS48JxJEGi8eJ84F2MVV1cjMPWuuTlI9v4LOt4xfQXqhqmP800sHniLIA9' 


export const getFirst10Chars = (text:any) =>  text?.length > 10 ? text.slice(0, 10) + '...' : text;
export const getFirstChars = (text:any) =>  text?.length > 7 ? text.slice(0, 7) + '...' : text;
