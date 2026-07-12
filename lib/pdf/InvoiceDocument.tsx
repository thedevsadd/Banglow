"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Booking } from "@/lib/store/bookings";
import { Property } from "@/lib/data/properties";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333333",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#C5A880",
    paddingBottom: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#0A0A0A",
  },
  tagline: {
    fontSize: 8,
    color: "#777777",
    marginTop: 2,
  },
  meta: {
    textAlign: "right",
  },
  metaText: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A0A0A",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#C5A880",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridCol: {
    width: "50%",
    marginBottom: 8,
  },
  label: {
    color: "#777777",
    fontSize: 8,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#111111",
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  tableHeader: {
    backgroundColor: "#F9F9F9",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableColDesc: {
    width: "60%",
  },
  tableColAmount: {
    width: "40%",
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 15,
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#999999",
    lineHeight: 1.4,
  },
});

interface InvoiceDocumentProps {
  booking: Booking;
  property: Property;
}

export function InvoiceDocument({ booking, property }: InvoiceDocumentProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date(booking.createdAt);
  const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const formatBDT = (amount: number) => {
    return "BDT " + amount.toLocaleString("en-IN");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>BANGLOW</Text>
            <Text style={styles.tagline}>Premium Real Estate Developments</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaText}>INVOICE: {booking.invoiceId}</Text>
            <Text style={styles.metaText}>Date: {formattedDate}</Text>
            <Text style={styles.metaText}>Tracker Serial: {booking.serialNumber}</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.title}>Allotment Reservation Invoice</Text>

        {/* Client & Booking Profiles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Details</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{booking.name}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{booking.email}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{booking.phone}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Country code</Text>
              <Text style={styles.value}>Bangladesh (+880)</Text>
            </View>
          </View>
        </View>

        {/* Property & Unit Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property & Unit Details</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Project Name</Text>
              <Text style={styles.value}>{property.name} Residency</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Territory Location</Text>
              <Text style={styles.value}>{property.area}, Dhaka</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Allocated Unit</Text>
              <Text style={styles.value}>Apartment {booking.unitId.replace(`${property.slug}-`, "").toUpperCase()}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Unit Dimensions</Text>
              <Text style={styles.value}>{property.atAGlance.unitSizeRange}</Text>
            </View>
          </View>
        </View>

        {/* Discussion Meeting Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allotment Discussion Slot</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Meeting Date</Text>
              <Text style={styles.value}>{booking.meetingDate}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Meeting Time</Text>
              <Text style={styles.value}>{booking.meetingTime}</Text>
            </View>
          </View>
        </View>

        {/* Financial Breakdown Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColDesc, styles.bold]}>Allotment Reservation Item</Text>
            <Text style={[styles.tableColAmount, styles.bold, { textAlign: "right" }]}>Amount (BDT)</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableColDesc}>Total Property Flat Price</Text>
            <Text style={styles.tableColAmount}>{formatBDT(booking.totalUnitPrice)}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableColDesc}>Booking Money Paid ({property.pricing.bookingMoneyPercent}%) via {booking.paymentMethod.toUpperCase()}</Text>
            <Text style={[styles.tableColAmount, styles.bold]}>{formatBDT(booking.bookingMoneyPaid)}</Text>
          </View>

          <View style={[styles.tableRow, { backgroundColor: "#F9F9F9", borderBottomWidth: 0 }]}>
            <Text style={[styles.tableColDesc, styles.bold]}>Remaining Due Balance</Text>
            <Text style={[styles.tableColAmount, styles.bold]}>{formatBDT(booking.remainingBalance)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Banglow Real Estate Ltd. | Banglow Tower, Plot 8B, Road 44, Gulshan 1, Dhaka 1212, Bangladesh
          </Text>
          <Text style={[styles.footerText, { marginTop: 4, fontStyle: "italic" }]}>
            This is a system-generated simulated receipt for educational and portfolio demonstration purposes only. No actual monetary exchange occurred.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
