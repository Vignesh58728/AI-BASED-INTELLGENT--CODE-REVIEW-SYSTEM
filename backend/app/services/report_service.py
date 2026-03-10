import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

class ReportService:
    @staticmethod
    def generate_weekly_pdf(user_name: str, stats: dict, output_path: str):
        """
        Generates a professional weekly progress report PDF.
        """
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Title
        title = Paragraph(f"<b>AIVISO WEEKLY PERFORMANCE REPORT</b>", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))

        # User Info
        elements.append(Paragraph(f"<b>User:</b> {user_name}", styles['Normal']))
        elements.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%Y-%m-%d')}", styles['Normal']))
        elements.append(Spacer(1, 24))

        # Stats Table
        data = [
            ['Metric', 'Value'],
            ['Problems Solved', str(stats.get('solved', 0))],
            ['Code Rating', str(stats.get('rating', 'N/A'))],
            ['Current Streak', str(stats.get('streak', 0)) + " Days"],
            ['Top Skill', stats.get('top_skill', 'N/A')]
        ]
        
        t = Table(data, colWidths=[200, 200])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.black),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(t)
        elements.append(Spacer(1, 24))

        # Footer
        elements.append(Paragraph("Keep coding and stay consistent!", styles['Italic']))

        doc.build(elements)
        return output_path

report_service = ReportService()
