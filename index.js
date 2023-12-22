const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());

const rooms = [
    {
        "roomName": "Super-Deluxe",
        "seats": 5,
        "amenities": "Air Conditioning,Free Wi-Fi",
        "PerHourPrice": 3000,
        "roomId": 1
    },
    {
        "roomName": "Premium",
        "seats": 3,
        "amenities": "Air Conditioning,Free Wi-Fi, TV",
        "PerHourPrice": 5000,
        "roomId": 2
    }
];
const bookingDetails = [
    {
        "customerName": "R Mohan",
        "Date": "19/12/2023",
        "StartTime": "10:00",
        "EndTime": "14:00",
        "roomId": 1,
        "bookingId": 1
    },
    {
        "customerName": "Durga",
        "Date": "20/12/2023",
        "StartTime": "11:00",
        "EndTime": "15:00",
        "roomId": 2,
        "bookingId": 2
    }
]

//      get all rooms & bookingDetails
app.get('/', (req, res) => {
    try {
        res.status(200).send({
            message: "All Rooms data fetched Successfully",
            rooms,
            bookingDetails
        })
    } catch (error) {
        res.status(500).send({
            message: "Interal issue",
            error: error.message
        })
    }
});

//      Create Room
app.post('/createRoom', (req, res) => {
    try {
        const { roomName, seats, amenities, PerHourPrice } = req.body;
        const roomId = rooms.length + 1;
        let room = {
            roomId,
            roomName,
            seats,
            amenities,
            PerHourPrice,
        }
        rooms.push(room)
        res.status(200).send({
            message: "new room created",
            room
        })
    } catch (error) {
        res.status(500).send({
            message: "Interal issue",
            error: error.message
        })
    }
});

//      Book Room
app.post('/bookRoom', (req, res) => {
    try {
        const { customerName, Date, StartTime, EndTime } = req.body;
        const bookingId = bookingDetails.length + 1;
        const roomId = rooms.length + 1;
        const booking = {
            customerName,
            Date,
            StartTime,
            EndTime,
            roomId,
            bookingId
        };
        bookingDetails.forEach((booked) => {
//  Same Roomid and date and time error...!!!!!            
            if (booked.roomId == booking.roomId){
                return res.status(400).send({ error: "Room was Already booked!...Please try another room" });
            }
                if (booked.Date == booking.Date && booked.StartTime == booking.StartTime) {
                    return res.status(400).send({ error: "Room was Already booked!...Please try another date and time" });
                } else {
                    bookingDetails.push(booking);
                }
        })
        res.status(200).send({
            message: "Room booked",
            booking
        })
    } catch (error) {
        res.status(400).send({
            message: "Room Booking error",
            error: error.message
        })
    }
})

//  list all rooms with booked data
app.get('/listAllRooms', (req, res) => {
    try {
        const bookingRooms = rooms.map((e) => {
            const bookedStatus = bookingDetails.find((booking) => booking.roomId === e.roomId);
            const booked_Status = bookingDetails ? "Booked" : "Available";
            return {
                RoomName: e.roomName,
                booked_Status,
                customer_name: bookedStatus.customerName,
                Date: bookedStatus.Date,
                start_time: bookedStatus.StartTime,
                end_time: bookedStatus.EndTime,
            }
        })
        res.status(200).send({
            message: "listallRooms listing done",
            bookingRooms
        })
    } catch (error) {
        res.status(500).send({
            message: "listAllRooms issue",
            error: error.message
        })
    }
})

//      list all customers with booked data
app.get('/allcustomers', (req, res) => {
    try {
        const allcustomersBookings = bookingDetails.map(booking => {
            const room = rooms.find(room => room.roomId === booking.roomId);
            return {
                Customer_Name: booking.customerName,
                Room_Name: room.roomName,
                Date: booking.Date,
                Start_Time: booking.StartTime,
                End_Time: booking.EndTime
            };
        });
        res.status(200).send({
            message: "AllCustomersBooking retrieved",
            allcustomersBookings
        });
    } catch (error) {
        res.status(500).send({
            message: "allcustomersbookings issue",
            error: error.message
        })
    }
});

//      list how many times a customer has booked the room with below details
app.get('/customersBookings/:customerName', (req, res) => {
    try {
        const { customerName } = req.params;
        const customerBookings = bookingDetails.filter((booking) => booking.customerName === customerName);
        const bookingDet = customerBookings.map((e) => {
            const room = rooms.find((a) => a.roomId === e.roomId);
            const booked_Status = customerBookings ? "Booked" : "Available";
            return {
                Customer_name: e.customerName,
                Room_name: room ? room.roomName : null,
                Date: e.Date,
                Star_time: e.StartTime,
                End_time: e.EndTime,
                Booking_id: e.bookingId,
                Booking_date: e.Date,
                booked_Status
            }
        })
        res.status(200).send({
            message: "customerBooked status",
            bookingDet
        });
    } catch (error) {
        res.status(500).send({
            message: "customer issue",
            error: error.message
        })
    }
});

app.listen(PORT, () => console.log(`App Listening to ${PORT}`));