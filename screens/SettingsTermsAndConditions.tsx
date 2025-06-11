import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

const SettingsTermsAndConditions = ({ navigation }: { navigation: any }) => {
  const { colors, dark } = useTheme();
  const textColor = dark ? COLORS.secondaryWhite : COLORS.greyscale900;
  const titleColor = dark ? COLORS.white : COLORS.black;

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Terms & Conditions" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: titleColor }]}>Terms and Conditions of Affare Doro</Text>
          <Text style={[styles.body, { color: textColor }]}>Date: 30/04/2025</Text>

          <Text style={styles.section}>1. Eligibility</Text>
          <Text style={[styles.body, { color: textColor }]}>
            You must be at least 18 years old to use Affare Doro. By using the Platform, you confirm that you meet this requirement and are capable of entering into a legally binding agreement.
          </Text>

          <Text style={styles.section}>2. Platform Purpose</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Affare Doro is a peer-to-peer marketplace for users to buy and sell new and second-hand items. Affare Doro is not a party to any transaction between users.
          </Text>

          <Text style={styles.section}>3. Account Registration</Text>
          <Text style={[styles.body, { color: textColor }]}>
            To use certain features, you must register and create an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials.
          </Text>

          <Text style={styles.section}>4. User Conduct</Text>
          <Text style={[styles.body, { color: textColor }]}>You agree not to:</Text>
          <Text style={[styles.body, { color: textColor }]}>• Post false, misleading, or fraudulent content.</Text>
          <Text style={[styles.body, { color: textColor }]}>• List or sell prohibited items.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Harass or abuse other users.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Interfere with the proper functioning of the Platform.</Text>
          <Text style={[styles.body, { color: textColor }]}>Affare Doro reserves the right to suspend or delete accounts that violate these rules.</Text>

          <Text style={styles.section}>5. Listings and Sales</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Users are solely responsible for the content of their listings and the lawful sale of items. All sales are binding once the buyer has confirmed the purchase.
          </Text>

          <Text style={styles.section}>6. Fees and Payments</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Affare Doro may charge a commission or service fee on transactions. These fees will be clearly disclosed before confirming any transaction. Payments are processed via secure third-party payment providers.
          </Text>

          <Text style={styles.section}>7. Disputes</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Any disputes between users should be resolved directly. Affare Doro may assist but is not obligated to mediate or resolve conflicts.
          </Text>

          <Text style={styles.section}>8. Intellectual Property</Text>
          <Text style={[styles.body, { color: textColor }]}>
            All content on the Platform, including logos, design, and text, is the property of Affare Doro or its licensors. Users may not use this content without written permission.
          </Text>

          <Text style={styles.section}>9. Termination</Text>
          <Text style={[styles.body, { color: textColor }]}>
            We may suspend or terminate your account if you breach these Terms or if your use of the Platform could cause harm to us or others.
          </Text>

          <Text style={styles.section}>10. Limitation of Liability</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Affare Doro is not responsible for any loss, damage, or harm resulting from transactions or interactions between users. The Platform is provided “as is” without warranties.
          </Text>

          <Text style={styles.section}>11. Privacy</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data.
          </Text>

          <Text style={styles.section}>12. Modifications</Text>
          <Text style={[styles.body, { color: textColor }]}>
            We reserve the right to modify these Terms at any time. Continued use of the Platform after such changes constitutes your acceptance.
          </Text>

          <Text style={styles.section}>13. Governing Law</Text>
          <Text style={[styles.body, { color: textColor }]}>
            These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved in the courts of UAE.
          </Text>

          <Text style={styles.section}>14. Buyer and Seller Protection</Text>

          <Text style={styles.subsection}>14.1. Buyer Protection</Text>
          <Text style={[styles.body, { color: textColor }]}>Buyers are protected if:</Text>
          <Text style={[styles.body, { color: textColor }]}>• The item is significantly not as described.</Text>
          <Text style={[styles.body, { color: textColor }]}>• The item does not arrive.</Text>
          <Text style={[styles.body, { color: textColor }]}>• The seller cancels after payment.</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Issues must be reported within 2 days of delivery. Affare Doro may freeze payments and offer refunds if claims are validated.
          </Text>

          <Text style={[styles.body, { color: textColor }]}>Buyers agree to:</Text>
          <Text style={[styles.body, { color: textColor }]}>• Pay only through the Platform.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Avoid direct transactions.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Provide correct delivery info.</Text>

          <Text style={styles.subsection}>14.2. Seller Protection</Text>
          <Text style={[styles.body, { color: textColor }]}>Sellers are protected if:</Text>
          <Text style={[styles.body, { color: textColor }]}>• Buyer falsely claims non-receipt and seller has proof.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Item is returned in a different condition.</Text>

          <Text style={[styles.body, { color: textColor }]}>Sellers must:</Text>
          <Text style={[styles.body, { color: textColor }]}>• Ship within 3 business days.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Use tracked shipping.</Text>
          <Text style={[styles.body, { color: textColor }]}>• Accurately describe items.</Text>

          <Text style={styles.subsection}>14.3. Returns and Refunds</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Returns are accepted only for disputes involving misrepresentation or damage. Refunds are issued only through the official dispute process.
          </Text>

          <Text style={styles.section}>15. Shipping Policy</Text>

          <Text style={styles.subsection}>15.1. Shipping Responsibility</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Sellers must ship within 3 business days and provide tracking. Items are shipped after payment.
          </Text>

          <Text style={styles.subsection}>15.2. Shipping Costs</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Costs may be paid by the buyer or included in the price. Sellers must clearly state this in the listing.
          </Text>

          <Text style={styles.subsection}>15.3. Delivery Timeframe</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Allow up to 10 business days for delivery. Delays due to couriers or customs are beyond Affare Doro’s control.
          </Text>

          <Text style={styles.subsection}>15.4. Lost or Undelivered Packages</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Buyers must report undelivered items within 2 days of the expected date. Sellers must provide valid tracking. Refunds may be issued if delivery cannot be confirmed.
          </Text>

          <Text style={styles.subsection}>15.5. Returned Items</Text>
          <Text style={[styles.body, { color: textColor }]}>
            Items must be returned in the same condition. Buyers must provide tracking. Return shipping is usually paid by the buyer.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Urbanist Bold',
    marginBottom: 16,
    marginTop: 8,
  },
  section: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    marginTop: 24,
    marginBottom: 6,
  },
  subsection: {
    fontSize: 14,
    fontFamily: 'Urbanist SemiBold',
    marginTop: 16,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    lineHeight: 22,
    marginBottom: 6,
  },
});

export default SettingsTermsAndConditions;
