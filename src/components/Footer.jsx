import React from 'react';
import "../css/Footer.css";
import footerFB from "../images/footer-fb.png";
import footerPin from "../images/footer-pin.png";

const Footer = () => {
    return (
    <footer id="footer">
    <div class="center">
        <nav class="sitemap">
            <div class="bundle">
                <div class="column">
                    <h1>Informatie</h1>
                    <a href="/info#locatie">Locatie</a>
                    <a href="/info#lid-worden">Lid worden</a>
                    <a href="/inschrijven">Inschrijven</a>
                    <a href="/info#groepverdeling">Groepen</a>
                    <a href="/info#kamp">Kamp en weekend</a>
                    <a href="/info#oudercomite">Bouwfonds</a>
                </div>
                <div class="column">
                    <h1>Verhuur</h1>
                    <a href="/verhuur#praktisch">Praktisch</a>
                    <a href="/verhuur#fotos">Foto's</a>
                    <a href="/verhuur#reserveren">Beschikbaarheid</a>
                </div>
            </div>
            <div class="bundle">
                <div class="column">
                    <h1>Foto's</h1>
                    <a href="/fotos/Pinkels">Pinkels</a>
                    <a href="/fotos/Speelclub">Speelclub</a>
                    <a href="/fotos/Rakwi">Rakwi</a>
                    <a href="/fotos/Tito">Tito</a>
                    <a href="/fotos/Keti">Keti</a>
                    <a href="/fotos/Aspi">Aspi</a>
                    <a href="/fotos/algemeen">Algemeen</a>
                </div>
                <div class="column">
                    <h1>Contact</h1>
                    <a href="/contact">Groepsleiding</a>
                    <a href="/contact">Leiding</a>
                    <a href="/contact">Bouwfond</a>
                    <a href="/contact">Verhuur</a>
                </div>
            </div>
            <div class="contact">
            <a href="https://maps.app.goo.gl/9SS1jFAG3rKu8wGB6">
                <img src={footerPin} alt=""/>
                <div>Anker 21a<br/>
                9260 Serskamp</div>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100063656889595">
                <img src={footerFB} alt=""/>
                <div>Like ons op Facebook</div>
            </a>
        </div>
        </nav>
    </div>
</footer>
    );
};

export default Footer;