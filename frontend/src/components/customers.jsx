import React, { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { deleteCustomer, getCustomers } from "../services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const settingCustomers = async () => {
      const { data: customers } = await getCustomers();
      setCustomers(customers);
    };
    settingCustomers();
  }, []);

  const filterCustomers = (currentCustomer) => {
    let customersCopy = [...customers];
    customersCopy = customersCopy.filter(
      (customer) => customer._id !== currentCustomer._id
    );
    return customersCopy;
  };

  const handleDelete = async (currentCustomer) => {
    const customers = filterCustomers(currentCustomer);
    setCustomers(customers);

    await deleteCustomer(currentCustomer);
  };

  return (
    <>
      <h1>Customers</h1>
      {customers.map((customer) => (
        <Accordion key={customer._id}>
          <AccordionItem eventKey="0">
            <AccordionHeader>
              <div> {customer.name} </div>
            </AccordionHeader>
            <AccordionBody>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 0.5fr",
                }}
              >
                <div className="text-responsive">
                  <strong>Customer Name: {customer.name} </strong>
                  <br />
                  <strong> Email: {customer.user.email} </strong>
                  <br />
                  <strong> Phone Number: {customer.phone} </strong>
                  <br />
                  <strong>
                    {" "}
                    Gold Member: {customer.isGold ? "Yes" : "No"}{" "}
                  </strong>
                  <br />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Button
                    variant="danger"
                    onClick={async () => await handleDelete(customer)}
                    className="btn-responsive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};

export default Customers;
