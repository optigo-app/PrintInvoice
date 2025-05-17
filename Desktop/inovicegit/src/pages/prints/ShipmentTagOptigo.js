// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=UVQyODE1Mw==&evn=c2hpcG1lbnQ=&pnm=c2hpcG1lbnQgb3B0aWdv&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined
import React from "react";
import "../../assets/css/prints/ShipmentOptigo.scss";

export default function ShipmentTagOptigo() {
  return (
    <div className="invoice-container">
      {/* Header */}
      <div className="header">
        <div className="party from">
          <img className="logo" src="https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4" alt="Optigo Logo" />
          <div className="address-block">
            <strong>FROM:</strong>
            <p>
              ABC Fine Jewellery Pvt Ltd.<br/>
              Shop no 1 Ground floor, Jewlolplex,<br/>
              Near Laxmi Jewellers, Ellisbridge,<br/>
              C.G Road, Ahmedabad-380006<br/>
              Phone: +91‑98••••••22
            </p>
          </div>
        </div>
        <div className="party to">
          <div className="address-block">
            <strong>TO:</strong>
            <p>
              Mahalaxmi Gold & Diamond LTD<br/>
              Mr. Rajesh Joshi (Purchase manager),<br/>
              123, Picnic Retail, Royal Park, Ring Road,<br/>
              Next to Hotel Hilton Park, Athwa,<br/>
              Surat‑395001, Gujarat ‑ India<br/>
              Phone: +91‑98••••••11
            </p>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Mid section */}
      <div className="mid-section">
        <div className="mid-left">
          <div className="row"><span className="label">Date:</span> 02 May 2025</div>
          <div className="row"><span className="label">Delivery By:</span> DTDC International Courier</div>
          <div className="row"><span className="label">Shipment:</span> DTDC15545RR</div>
        </div>
        <div className="mid-center">
          <div className="order-no"><strong>Order No.</strong><br/>12345678912</div>
        </div>
        <div className="mid-right">
          <img className="qr-code" src="https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4" alt="QR Code" />
          <p className="qr-caption">Scan with Optigo App SCAVU</p>
        </div>
      </div>

      <hr className="divider" />

      {/* Footer */}
      <div className="footer">
        <h4>Introducing SCAVU: A Smarter Way to Connect Buyers & Sellers!</h4>
        <p>Say goodbye to manual data entry – with SCAVU go for Seamless Data Exchange.</p>
        <ul>
          <li>Automatic PO & invoice imports</li>
          <li>Reduced manual errors & delays</li>
          <li>Transparent, real‑time collaboration</li>
          <li>Significant time and cost savings daily</li>
        </ul>
        <div className="footer-qr">
          <img className="small-qr" src="https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4" alt="Download App QR" />
          <div className="download-text">
            <strong>Download App</strong><br/>
            Optigo‑SCAVU
          </div>
        </div>
      </div>
    </div>
  );
}
