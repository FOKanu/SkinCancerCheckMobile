import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

// Mock data for specialists
const specialists = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Dermatologist',
    location: '123 Medical Center Dr, Suite 100',
    city: 'San Francisco, CA',
    phone: '(415) 555-0123',
    email: 'dr.johnson@dermclinic.com',
    availability: ['2024-03-20', '2024-03-21', '2024-03-22'],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    location: '456 Health Plaza, Suite 200',
    city: 'San Francisco, CA',
    phone: '(415) 555-0124',
    email: 'dr.chen@dermclinic.com',
    availability: ['2024-03-20', '2024-03-23', '2024-03-24'],
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    location: '789 Wellness Way, Suite 300',
    city: 'San Francisco, CA',
    phone: '(415) 555-0125',
    email: 'dr.rodriguez@dermclinic.com',
    availability: ['2024-03-21', '2024-03-22', '2024-03-25'],
  },
];

export default function ScheduleScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [showSpecialists, setShowSpecialists] = useState(false);
  const [availableSpecialists, setAvailableSpecialists] = useState([]);

  // Generate marked dates for the next 2 years
  const generateMarkedDates = () => {
    const markedDates = {};
    const today = new Date();
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(today.getFullYear() + 2);

    specialists.forEach(specialist => {
      specialist.availability.forEach(date => {
        if (!markedDates[date]) {
          markedDates[date] = {
            marked: true,
            dotColor: '#3498db',
          };
        }
      });
    });

    return markedDates;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    const available = specialists.filter(specialist =>
      specialist.availability.includes(date.dateString)
    );
    setAvailableSpecialists(available);
    setShowSpecialists(true);
  };

  const handleBookAppointment = (specialist) => {
    // Here you would typically navigate to a booking confirmation screen
    // or show a booking confirmation modal
    alert(`Appointment booked with ${specialist.name} for ${selectedDate}`);
    setShowSpecialists(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Appointment</Text>
      </View>

      <ScrollView style={styles.content}>
        <Calendar
          style={styles.calendar}
          minDate={new Date().toISOString().split('T')[0]}
          maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))
            .toISOString()
            .split('T')[0]}
          markedDates={generateMarkedDates()}
          onDayPress={handleDateSelect}
          theme={{
            todayTextColor: '#3498db',
            selectedDayBackgroundColor: '#3498db',
            selectedDayTextColor: '#ffffff',
            dotColor: '#3498db',
            selectedDotColor: '#ffffff',
          }}
        />

        <Modal
          visible={showSpecialists}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowSpecialists(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Available Specialists for {selectedDate}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowSpecialists(false)}
                >
                  <Ionicons name="close" size={24} color="#2c3e50" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.specialistsList}>
                {availableSpecialists.map((specialist) => (
                  <View key={specialist.id} style={styles.specialistCard}>
                    <Text style={styles.specialistName}>{specialist.name}</Text>
                    <Text style={styles.specialistSpecialty}>
                      {specialist.specialty}
                    </Text>
                    <View style={styles.specialistDetails}>
                      <Ionicons name="location" size={16} color="#7f8c8d" />
                      <Text style={styles.specialistLocation}>
                        {specialist.location}
                      </Text>
                    </View>
                    <View style={styles.specialistDetails}>
                      <Ionicons name="call" size={16} color="#7f8c8d" />
                      <Text style={styles.specialistContact}>
                        {specialist.phone}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => handleBookAppointment(specialist)}
                    >
                      <Text style={styles.bookButtonText}>Book Appointment</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  calendar: {
    margin: 16,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  specialistsList: {
    maxHeight: '100%',
  },
  specialistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  specialistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  specialistSpecialty: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  specialistDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  specialistLocation: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  specialistContact: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  bookButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
