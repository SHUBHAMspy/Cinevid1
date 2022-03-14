import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { withRouter } from "react-router";
import authenticationService from "../services/authenticationService";
import { getIndividualCustomer } from "../services/customerService";
import { deleteRental, getCustomerRentals } from "../services/rentalService";
import { returnMovie } from "../services/returnService";

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const { _id: userId } = authenticationService.getCurrentUser();

  useEffect(() => {
    const settingRentals = async () => {
      const customer = await getIndividualCustomer(userId);
      const rentals = await getCustomerRentals(customer);
      setRentals(rentals);
    };
    settingRentals();
  }, []);

  const filterRentals = (currentRental) => {
    let rentalsCopy = [...rentals];
    rentalsCopy = rentalsCopy.filter(
      (rental) => rental._id !== currentRental._id
    );
    return rentalsCopy;
  };
  const handleDelete = async (currentRental) => {
    const rentals = filterRentals(currentRental);
    setRentals(rentals);

    await deleteRental(currentRental);
  };
  const handleReturn = async (currentRental) => {
    let rentals = filterRentals(currentRental);

    const { data: rental } = await returnMovie(
      currentRental.customer._id,
      currentRental.movie._id
    );
    //console.log(rental);
    rentals.push(rental);
    setRentals(rentals);
  };

  return (
    <>
      <h2>Rentals</h2>
      {rentals.map((rental) => (
        <Accordion key={rental._id}>
          <AccordionItem eventKey="0" className="col-md-12">
            <AccordionHeader>
              <div
              // style={{
              //   display: "grid",
              //   gridTemplateColumns: "2fr 0.5fr",
              //   columnGap: "250px",
              // }}
              >
                <div> {rental.movie.title} </div>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 0.5fr 0.5fr",
                }}
              >
                <div className="text-responsive">
                  <strong>Movie Name: {rental.movie.title} </strong>
                  <br />
                  <strong> Daily Rent: {rental.movie.dailyRentalRate} </strong>
                  <br />
                  <strong> Rented On: {rental.dateOut} </strong>
                  <br />
                  <strong> Return Date: {rental.dateReturned} </strong>
                  <br />
                </div>

                <strong
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                  }}
                  className="text-responsive"
                >
                  FeeAmount:{rental.rentalFee}
                </strong>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <button
                    variant="info"
                    onClick={async () => await handleReturn(rental)}
                    className="btn btn-info btn-responsive"
                  >
                    Return
                  </button>
                  {rental.dateReturned && (
                    <button
                      className="btn btn-danger btn-responsive"
                      onClick={async () => await handleDelete(rental)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};

export default withRouter(Rentals);
