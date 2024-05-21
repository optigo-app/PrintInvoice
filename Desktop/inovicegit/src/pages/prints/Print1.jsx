import React from 'react'
import Print1Quote from './Print1/Print1Quote'


const Print1 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    return (
        <>      
            { atob(evn) === 'quote' && <Print1Quote token={token} invoiceNo={invoiceNo} printName={printName} urls={urls} evn={evn} ApiVer={ApiVer} /> }
        </>
    )
}

export default Print1