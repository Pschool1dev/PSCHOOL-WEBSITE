<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificat - {{ $certificat->numero_certificat }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 1cm;
        }
        
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
        }
        
        table {
            width: 100%;
            height: 100%;
            border-collapse: collapse;
        }
        
        .border-outer {
            border: 3px solid #1a56db;
            padding: 15px;
        }
        
        .border-inner {
            border: 1px solid #1a56db;
            padding: 20px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .logo img {
            height: 90px;
            width: auto;
        }
        
        .certificat-title {
            font-size: 36px;
            font-weight: bold;
            color: #1a56db;
            text-transform: uppercase;
            text-align: center;
        }
        
        .certificat-subtitle {
            font-size: 14px;
            color: #6b7280;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .content {
            text-align: center;
            margin: 30px 0;
        }
        
        .decerner-a {
            font-size: 14px;
            color: #4b5563;
        }
        
        .apprenant-nom {
            font-size: 28px;
            font-weight: normal;
            color: #111827;
            margin: 15px 0;
            text-transform: uppercase;
        }
        
        .formation-completion {
            font-size: 14px;
            color: #4b5563;
        }
        
        .formation-nom {
            font-size: 22px;
            font-weight: bold;
            color: #1a56db;
            margin: 15px 0;
        }
        
        .date-delivrance {
            font-size: 12px;
            color: #6b7280;
            margin: 20px 0;
        }
        
        .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        
        /* Style pour les informations de l'école  */
        .school-info {
            text-align: left;
            font-size: 10px;
            color: #111827;
            line-height: 1.4;
        }
        
        .school-name {
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        
        .school-phone {
            font-size: 10px;
        }
        
        /* Style pour la signature */
        .signature {
            text-align: right;
        }
        
        .signature-ligne {
            width: 180px;
            border-top: 1px solid #111827;
            margin-left: auto;
            margin-top: 5px;
            margin-bottom: 5px;
        }
        
        .signature-nom {
            font-size: 11px;
            font-weight: bold;
            color: #111827;
            font-style: italic;
        }
        
        .signature-fonction {
            font-size: 9px;
            color: #4b5563;
        }
        
        .numero-certificat {
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <table>
        <tr>
            <td class="border-outer">
                <div class="border-inner">
             
                    <div class="logo">
                        <img src="{{ public_path('assets/logo-removebg-preview (1).png') }}" alt="Programming School Logo" style="height: 90px; width: auto;">
                    </div>
                    
                    <div class="certificat-title">CERTIFICAT DE REUSSITE </div>
                   
                    
                    <div class="content">
                        <div class="decerner-a">Ce certificat est décerné à</div>
                        <div class="apprenant-nom">{{ strtoupper($certificat->user->nom) }}</div>
                        
                        <div class="formation-completion">pour avoir complété avec succès la formation</div>
                        <div class="formation-nom">{{ $certificat->formation->titre }}</div>
                        
                        <div class="date-delivrance">
                            Délivré le {{ $certificat->date_delivrance->format('d/m/Y') }}
                        </div>
                    </div>
                    
                    <div class="footer">
                     
                        <div class="school-info">
                            <div class="school-name">PROGRAMMING SCHOOL (PS)</div>
                            <div class="school-phone">+226 02 88 05 83</div>
                        </div>
                        
                   
                        <div class="signature">
                            <div class="signature-nom">TIENDREBEOGO/CAMARA FATIMATA</div>
                            <div class="signature-fonction">La Directrice</div>
                            <div class="signature-ligne"></div>
                        </div>
                    </div>
                    
                    <div class="numero-certificat">
                        Certificat N°: {{ $certificat->numero_certificat }}
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>