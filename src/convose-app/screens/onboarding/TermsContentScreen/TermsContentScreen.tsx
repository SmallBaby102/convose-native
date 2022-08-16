/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/style-prop-object */

import React, { useContext } from "react"
import { NavigationInjectedProps } from "react-navigation"

import { Routes } from "convose-lib/router"
import { StatusBar } from "expo-status-bar"
import { Platform } from "react-native"
import { ThemeContext } from "styled-components"
import {
  ConfirmButton,
  Container,
  StyledScrollView,
  TermsText,
  TermslistText,
  StyledView,
  Title,
} from "./Styled"
import { BackButton } from "../../../screens/auth/styled"
import { StatusBarBackground } from "../../chatbox-list/Styled"

export const TermsContentScreen: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const subTitleSize = "18px"
  const headingSize = "26px"
  const goBack = () => navigation.goBack()
  const navigateToAddInterests = () => {
    navigation.navigate(Routes.OnboardingInterest)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)
  return (
    <StyledScrollView>
      <StatusBar style="dark" />
      {Platform.OS !== "ios" && <StatusBarBackground />}
      <StyledView>
        <Container>
          <Title fontSize={headingSize}>
            Convose&apos;s Terms and Conditions of Use
          </Title>
          <TermsText>
            The Terms and any dispute or claim arising out of or in connection
            with it or its subject matter (including non-contractual disputes or
            claims) shall be governed by and construed in accordance with German
            law. In the event there is a discrepancy between this English
            language version and any translated copies of the Website Terms and
            Conditions, the English version shall prevail.
          </TermsText>

          <Title>The Summary</Title>
          <TermsText>
            Hello. You should read these terms and conditions in full because
            they apply every time you visit Convose. However, just in case you
            ever need a reminder of the main points, here’s a quick summary:
          </TermsText>
          <TermslistText>
            {
              "1. If you are under the age of 17 then unfortunately you can’t use Convose yet. \n2. We’re not responsible for any content you send or upload, but if we do see or someone alerts us that you have uploaded something that we think is inappropriate then we are allowed at our discretion to remove it. \n3. If you send or upload any content that actually belongs to someone else and they get annoyed (or even call in their lawyers), we are not in the firing line. You have to take responsibility for what you post. \n4. If you are concerned about how your data is being used by Convose then please refer to our Privacy Policy. It will tell you all you need to know."
            }
          </TermslistText>

          <Title>The full legal bit</Title>
          <TermsText>
            Convose is a social media website and app designed to be platform
            for meeting new people that bring value to your life, a place to
            have discussions and exchange information. It is intended to be a
            fun place to visit and it is important to us (and for you) that it
            remains a safe and friendly environment so you agree that you will
            only use Convose in a manner consistent with its purpose and which
            is in accordance with these terms and conditions (the “Terms”).
          </TermsText>
          <TermsText>
            The Terms constitute a binding legal agreement between you as a user
            (“you”) and Convose UG (Limited Liability), a German company whose
            registered office is Media Village, 131 - 151 Great Titchfield
            Street, London, W1W 5BB (“we” or “us”) of www.Convose.com (together
            with affiliated websites and applications, “Convose”). Convose UG
            (Limited Liability).
          </TermsText>
          <TermsText>
            The Terms apply whenever you visit Convose, whether or not you have
            chosen to register with us, so please read them carefully. By
            accessing, using, registering for or receiving services offered on
            Convose (the “Services”) you are accepting and agreeing to be bound
            by the Terms.
          </TermsText>
          <TermsText>
            IF YOU DO NOT ACCEPT AND AGREE TO THE TERMS THEN YOU MUST NOT ACCESS
            OR USE THE APP OR SITE.
          </TermsText>

          <Title>
            1. Use of the app and site and rules relating to content
          </Title>
          <Title fontSize={subTitleSize}>Who can use Convose?</Title>
          <TermsText>
            Convose is a meeting place for adults. You may only use and become a
            registered member of Convose if you are 18 years old or older (or
            the age of majority in the country in which you reside if that
            happens to be greater than 18).
          </TermsText>
          <TermsText>
            You warrant that you have the right, authority and capacity to enter
            into and be bound by the Terms and that by using Convose you will
            not be violating any law or regulation of the country in which you
            are resident. You are solely responsible for your compliance with
            all applicable local laws and regulations.
          </TermsText>
          <TermsText>
            You further warrant that you have not been convicted of, nor are
            subject to any court order relating to assault, violence, sexual
            misconduct or harassment.
          </TermsText>

          <Title fontSize={subTitleSize}>
            What kind of content can I send and upload on Convose?
          </Title>
          <TermsText>
            {
              "You are able to send and upload all kinds of things on Convose, including photographs, messages and other content (“Content”). \nThere are some rules about what is acceptable though, so when you are using Convose you may not upload or send any Content which:"
            }
          </TermsText>
          <TermslistText>
            {
              "1. contains expletives or language which could be deemed offensive or is likely to harass, upset, embarrass, alarm or annoy any other person;\n2. is obscene, pornographic or otherwise may offend human dignity;\n3. is abusive, insulting or threatening, or which promotes or encourages racism, sexism, hatred or bigotry;\n4. encourages any illegal activity including, without limitation, terrorism, inciting racial hatred or the submission of which in itself constitutes committing a criminal offence;\n5. is defamatory;\n6. relates to commercial activities (including, without limitation, sales, competitions and advertising, links to other websites or premium line telephone numbers);\n7. involves the transmission of “junk” mail or “spam”;\n8. contains any spy ware, adware, viruses, corrupt files, worm programmes or other malicious code designed to interrupt, damage or limit the functionality of or disrupt any software, hardware, telecommunications, networks, servers or other equipment, Trojan horse or any other material designed to damage, interfere with, wrongly intercept or expropriate any data or personal information whether from Convose or otherwise;\n9. itself, or the posting of which, infringes any third party’s rights (including, without limitation, intellectual property rights and privacy rights); or\n10. shows another person which was created or distributed without that person’s consent."
            }
          </TermslistText>
          <TermsText>
            Please use your common sense when picking the Content that you
            choose to send or upload on or send via Convose because you are
            solely responsible for, and bear all liability in relation to, such
            Content.
          </TermsText>

          <Title fontSize={subTitleSize}>
            Are there any rules relating to personal information like my email
            address?
          </Title>
          <TermsText>
            You may not display any personal contact or banking information on
            your individual profile page (“Profile”) whether in relation to you
            or any other person (for example, names, home addresses or
            postcodes, telephone numbers, email addresses, URLs, credit/debit
            card or other banking details). If you do choose to reveal any
            personal information about yourself to other users, whether via
            email or otherwise, it is at your own risk. We encourage you to use
            the same caution in disclosing details about yourself to third
            parties online as you would under any other circumstances.
          </TermsText>

          <Title fontSize={subTitleSize}>
            What about other people’s personal information, can I use it?
          </Title>
          <TermsText>
            You may only use other Convose user’s personal information to the
            extent that your use of it matches Convose’s purpose. You may not
            use other users&apos; information for commercial purposes, to spam,
            to harass, or to make unlawful threats. Convose reserves the right
            to terminate your account if you misuse other users&apos;
            information.
          </TermsText>

          <Title fontSize={subTitleSize}>
            Some of my friends want to see all the people I’m chatting with. Can
            I tell them my login details and let them log on as me?
          </Title>
          <TermsText>
            The short answer is no. Only you are authorised to access your
            account with Convose. You must not share your login details with
            anyone or let anyone else access your account as this jeopardises
            the security of all of the Content and personal information that you
            have submitted to Convose. You are responsible for keeping your
            login details secret and secure. If you don’t, Convose is not liable
            for any unauthorised access to your account. If you suspect that
            someone has gained access to your account, you must let us know
            immediately by visiting Feedback page and telling us of your
            suspicions or concerns. You must also immediately change your login
            details. Convose reserves the right to terminate your account if you
            violate our rules on keeping your login details secure.
          </TermsText>

          <Title fontSize={subTitleSize}>
            Who can see the Content that I put on Convose?
          </Title>
          <TermsText>
            When you upload Content to Convose it can be accessed and viewed by
            the general public. If do not want such Content to be viewed by
            others, then you should not upload it to Convose. We reserve the
            right (without obligation) at our sole discretion and without giving
            you notice, to remove or edit, limit or block access to any Content
            that you upload or submit to Convose without any incurring liability
            to you. We have no obligation to display any Content that you submit
            to Convose, nor to check the accuracy or truthfulness of any Content
            submitted to Convose, nor to monitor your use or the use of other
            users of Convose.
          </TermsText>

          <Title>2. Ownership of Content</Title>
          <Title fontSize={subTitleSize}>
            Once I have uploaded Content on Convose, do I still own it?
          </Title>
          <TermsText>
            Yes (provided you are the rightful owner in the first place — please
            see our other rules regarding posting Content that doesn’t belong to
            you).
          </TermsText>
          <TermsText>
            Please note though that by posting or sending Content on Convose you
            represent and warrant to us that you have the right to do so, and
            automatically grant to us a non-exclusive, royalty free, perpetual,
            worldwide licence to use such Content in any way (including, without
            limitation, editing, copying, modifying, adapting, translating,
            reformatting, creating derivative works from, incorporating into
            other works, advertising, distributing and otherwise making
            available to the general public such Content, whether in whole or in
            part and in any format or medium currently known or developed in the
            future).
          </TermsText>
          <TermsText>
            We may assign and/or sub-licence the above licence to our affiliates
            and successors without any further approval by you.
          </TermsText>
          <TermsText>
            By submitting Content to Convose you are warranting that you are the
            exclusive author and owner of that Content and you agree that you
            waive any and all moral rights relating to that Content (including,
            without limitation, the right to be identified as the author).
          </TermsText>
          <TermsText>
            We have the right to disclose your identity to any third party who
            is claiming that any Content sent or uploaded by you to our app or
            site constitutes a violation of their intellectual property rights
            or of their right to privacy or any other law.
          </TermsText>

          <Title fontSize={subTitleSize}>
            Who does the rest of the Content on Convose belong to then?
          </Title>
          <TermsText>
            All text, graphics, user interfaces, trademarks, logos, sounds and
            artwork on Convose are owned, controlled or licensed by us and are
            protected by copyright, trademark and other intellectual property
            law rights.
          </TermsText>

          <Title fontSize={subTitleSize}>
            Can I use any of the Content that doesn’t belong to me?
          </Title>
          <TermsText>
            Other than in relation to Content submitted by you to Convose, you
            do not have any rights in relation to the Content on Convose and you
            agree that you will not use any Content in any manner which may
            infringe any third party’s rights. Without limitation to the
            foregoing, this means that you agree that you will not copy, modify,
            adapt, distribute, publish or sell all or any part of the Convose
            site or the Content contained on it (other than the Content
            submitted by you) to anyone else.
          </TermsText>

          <Title>3. Access to the app and site</Title>
          <Title fontSize="18px">
            Do you guarantee that Convose will be up and running at all times?
          </Title>
          <TermsText>
            Unfortunately we can’t guarantee that because sometimes we have to
            carry out maintenance to the app or site or they may be affected by
            a fault or circumstances which are outside our control, so Convose
            is provided on an “as is” basis. No warranty is given about the
            quality, accuracy, functionality, availability or performance of
            Convose and we reserve the right to suspend, withdraw, amend, modify
            or vary the service provided on Convose without notice and without
            incurring any liability to you.
          </TermsText>

          <Title fontSize="18px">What about mobile access?</Title>
          <TermsText>
            You are responsible for making all the necessary arrangements to
            ensure you can access Convose (including, but not limited to
            Internet provider and mobile internet provider fees and, any other
            charges associated with such access). We shall not be held
            responsible for any reduced functionality you may encounter as
            result of or in connection with accessing Convose through mobile
            services or any similar service currently known or developed in the
            future.
          </TermsText>
          <TermsText>
            By accessing Convose or agreeing to receive messages or
            notifications from Convose through your mobile phone and/or any
            other connected media device, you accept that you may incur charges
            from your internet or mobile service provider. We shall not under
            any circumstances be liable for such charges.
          </TermsText>

          <Title fontSize="18px">
            I’m not registered and I can’t seem to access some Content on the
            app or site. Why is that?
          </Title>
          <TermsText>
            Non-registered users are able to access only that portion of Convose
            that is publicly available. They will not have a Profile or an inbox
            or the ability to upload a profile picture or change their username.
          </TermsText>

          <Title>4. Termination of use by us</Title>
          <Title fontSize="18px">
            My Profile has disappeared and I can’t log in. What’s going on?
          </Title>
          <TermsText>
            Sometimes people forget about the Terms and send or upload Content
            or act in a way while on Convose which is not consistent with the
            purpose of the app or site. If we think that you may be one of those
            people, then we reserve the right at our sole discretion, at any
            time and without liability or the need to give you prior notice to:
          </TermsText>
          <TermslistText>
            {
              "1. suspend or revoke your registration (where applicable) and your right to access and/or use Convose or submit any Content to Convose; and\n2. make use of any operational, technological, legal, or other means available to enforce the Terms (including without limitation blocking specific IP addresses)."
            }
          </TermslistText>
          <TermsText>
            We will try (but we are not obliged) to notify you if your access to
            Convose and/or your Profile is to be or has been suspended or
            terminated.
          </TermsText>

          <Title>5. Abuse/Complaints</Title>
          <Title fontSize="18px">
            Someone is not obeying the Terms, who do I tell?
          </Title>
          <TermsText>
            {
              "You can report any abuse or complain about Content on Convose by contacting us here: convsose1@gmail.com, and outlining the abuse and or complaint. "
            }
          </TermsText>
          <TermsText>
            We will always try our best to help resolve any issue that you may
            encounter with our service. If your complaint or dispute remains
            unresolved, however, you may be eligible to use the European
            Commission’s Online dispute resolution platform here.
          </TermsText>

          <Title>6. Privacy Policy</Title>
          <Title fontSize="18px">
            Do you have guidelines in place about what you can do with my
            personal data?
          </Title>
          <TermsText>
            We process information in accordance with our Privacy Policy which
            is incorporated into these Terms and Conditions of Use. Please read
            the terms of our Privacy Policy prior to using Convose. By using
            Convose, you agree to such processing and you warrant that all data
            provided by you is true, correct and accurate.
          </TermsText>

          <Title>7. Links</Title>
          <Title fontSize="18px">
            Are the links on the app or site anything to do with Convose?
          </Title>
          <TermsText>
            Convose may contain links to other sites, resources and purchase
            opportunities provided by third parties. These links are provided to
            you for your information only. If you access these links you may be
            directed to third party sites. These third party sites will have
            their own terms of use and privacy policies, which may differ from
            the Terms. The display of links to third party sites does not
            constitute an endorsement by us of any of the third party content
            information, sites, or resources provided.
          </TermsText>
          <TermsText>
            Please note that we have no control over the contents of any third
            party sites or resources, and we accept no responsibility for them,
            including (but not limited to) the third party site’s compliance
            with any applicable laws or regulations.
          </TermsText>

          <Title>8. Disclaimer of warranties and limitation of liability</Title>
          <Title fontSize="18px">
            I forgot the rules about conduct on here and now someone is
            threatening to sue me. Will your lawyers sort it out?
          </Title>
          <TermsText>
            No. If you act in a way that upsets other users then you have to be
            responsible for the consequences. We expressly disclaim any and all
            responsibility and liability for your conduct or the conduct of any
            other user of Convose, and expressly disclaim any liability for
            Content uploaded by you or by any other user.
          </TermsText>
          <Title fontSize="18px">
            My friend is a lawyer and says that you can’t exclude liability for
            everything…
          </Title>
          <TermsText>
            Nothing in the Terms limits or excludes our liability for:
          </TermsText>
          <TermslistText>
            {
              "1. death or personal injury caused by our proven negligence; or\n2. any liability which cannot be limited or excluded by law."
            }
          </TermslistText>
          <TermsText>
            To the fullest extent permitted by law, Convose expressly excludes:
          </TermsText>
          <TermslistText>
            {
              "1. all conditions, representations, warranties and other terms which might otherwise be implied by statute, common law or the law of equity; and\n2. any liability incurred by you arising from use of Convose, its services or these terms and conditions, including without limitation for any claims, charges, demands, damages, liabilities, losses or expenses of whatever nature and howsoever direct, indirect, incidental, special, exemplary, punitive or consequential damages (however arising including negligence), loss of use, loss of data, loss caused by a computer or electronic virus, loss of income or profit, loss of or damage to property, wasted management or office time, breach of contract or claims of third parties or other losses of any kind or character, even if Convose has been advised of the possibility of such damages or losses, arising out of or in connection with the use of Convose. This limitation on liability applies to, but is not limited to, the transmission of any disabling device or virus that may infect your equipment, failure or mechanical or electrical equipment or communication lines, telephone or other interconnect problems (e.g., you cannot access your internet service provider), unauthorized access, theft, bodily injury (other than caused by our negligence), property damage, operator errors, strikes or other labor problems or any act of god in connection with Convose including, without limitation, any liability for loss of revenue or income, loss of profits or contracts, loss of business, loss of anticipated savings, loss of goodwill, loss of data, wasted management or office time and any other loss or damage of any kind, however arising and whether caused by tort (including, but not limited to, negligence), breach of contract or otherwise, even if foreseeable whether arising directly or indirectly."
            }
          </TermslistText>

          <Title>9. Indemnity</Title>
          <Title fontSize="18px">
            I forgot the rules about conduct on here and now someone is
            threatening to sue YOU. What now?
          </Title>
          <TermsText>
            If we are sued as a result of your use of Convose then we have the
            right to defend or settle the relevant claim as we see fit. If we
            ask, you will co-operate fully and reasonably as required by us in
            the defence of any relevant claim.
          </TermsText>
          <TermsText>
            You agree to hold harmless and indemnify us and our officers,
            directors, employees, agents, representatives and licensors from and
            against any third party claims, damages (actual and/or
            consequential), actions, proceedings, demands, losses, liabilities,
            costs and expenses (including reasonable solicitor’s fees) suffered
            or reasonably incurred by us arising as a result of, or in
            connection with, your access to and use of Convose, the uploading or
            submission of Content to Convose by you or your conduct, other than
            in accordance with the Terms or any applicable law or regulation
            (“Claim”). Convose retains the exclusive right to settle, compromise
            and pay any and all Claims or causes of action which are brought
            against us without your prior consent.
          </TermsText>

          <Title>10. Miscellaneous</Title>
          <Title fontSize="18px">
            What about all of those standard clauses that you see at the end of
            most contracts? They’re the best bit!
          </Title>
          <TermsText>As you asked so nicely…</TermsText>
          <TermsText>
            Convose has taken reasonable steps to ensure the currency,
            availability, correctness and completeness of the information
            contained on Convose and provides that information on an &quot;as
            is&quot;, &quot;as available&quot; basis. Convose does not give or
            make any warranty or representation of any kind about the
            information contained on Convose, whether express or implied. Use of
            Convose and the materials available on it is at your sole risk.
            Convose cannot be held responsible for any loss arising from the
            transmission, use of data, or inaccurate Content posted by users.
            You are responsible for taking all necessary precautions to ensure
            that any material you may obtain from Convose is free of viruses or
            other harmful components. You accept that Convose will not be
            provided uninterrupted or error free, that defects may not be
            corrected or that Convose, or the server that makes it available,
            are free of viruses or bugs, spyware, Trojan horses or any similar
            malicious software. Convose is not responsible for any damage to
            your computer hardware, computer software, or other equipment or
            technology including, but without limitation damage from any
            security breach or from any virus, bugs, tampering, fraud, error,
            omission, interruption, defect, delay in operation or transmission,
            computer line or network failure or any other technical or other
            malfunction.
          </TermsText>
          <TermsText>
            We reserve the right to modify, amend or change the Terms at any
            time (a “Change”). If we do this then the Changes will be posted on
            this page and we will indicate the effective date of the updates at
            the bottom of the Terms. In certain circumstances, we may send an
            email to you notifying you of any Change. You should regularly check
            this page to take notice of any Changes.
          </TermsText>
          <TermsText>
            If you do not accept any Change to the Terms, you should stop using
            Convose immediately. Your continued use of Convose following any
            Change constitutes your acceptance of the Change and you will be
            legally bound by the new updated Terms.
          </TermsText>
          <TermsText>
            If, for any reason, any of the Terms are declared to be illegal,
            invalid or otherwise unenforceable by a court of a competent
            jurisdiction, then to the extent that term is illegal, invalid or
            unenforceable, it shall be severed and deleted from the Terms and
            the remainder of the Terms shall survive, remain in full force and
            effect and continue to be binding and enforceable.
          </TermsText>
          <TermsText>
            The Terms set out the entire agreement and understanding between us
            and you in relation to your use of Convose and supersedes all
            previous agreements, representations and arrangements between us
            (either oral or written). Nothing in this clause shall limit or
            exclude any liability for fraudulent misrepresentation.
          </TermsText>
          <TermsText>
            No failure or delay by us in exercising any right, power or
            privilege under the Terms shall operate as a waiver of such right or
            acceptance of any variation of the Terms and nor shall any single or
            partial exercise by either party of any right, power or privilege
            preclude any further exercise of that right or the exercise of any
            other right, power or privilege.
          </TermsText>
          <TermsText>
            Nothing in the Terms shall confer or purport to confer on any other
            third party, any benefit or the right to enforce any term of the
            Terms and the Contracts (Rights of Third Parties) Act 1999 shall not
            apply to the Terms.
          </TermsText>

          <Title>About us</Title>
          <TermsText>
            www.Convose.com is an app and site owned and operated by Convose UG
            (Limited Liability).
          </TermsText>
          <TermsText>
            We are registered in Germany under company number HRB 200770.
          </TermsText>
          <TermsText>
            Our registered office is at Rheinsberger Str. 76/77, 10115 Berlin,
            Germany
          </TermsText>

          <Title>Effective date</Title>
          <TermsText>The Terms were last updated on: 6th May 2016.</TermsText>

          <ConfirmButton onPress={navigateToAddInterests} label="I agree" />

          <BackButton
            name="ios-chevron-back"
            onPress={goBack}
            size={30}
            iconColor={theme.mainBlue}
            top={23}
            left={-5}
          />
        </Container>
      </StyledView>
    </StyledScrollView>
  )
}
