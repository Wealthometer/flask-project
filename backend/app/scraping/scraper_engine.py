import requests
from bs4 import BeautifulSoup
from app.extensions import db
from app.models import Scholarship

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


# 1. OPPORTUNITY DESK
def scrape_opportunity_desk():
    url = "https://opportunitydesk.org/category/scholarships/"

    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")

        posts = soup.find_all("article")

        added = 0

        for post in posts:
            title_tag = post.find("h2")
            link_tag = post.find("a")

            if not title_tag or not link_tag:
                continue

            title = title_tag.text.strip()
            link = link_tag["href"]

            exists = Scholarship.query.filter_by(application_link=link).first()
            if exists:
                continue

            db.session.add(Scholarship(
                title=title,
                provider="Opportunity Desk",
                application_link=link,
                description=title
            ))

            added += 1

        db.session.commit()
        return added

    except:
        return 0



# 2. SCHOLARSHIPS.COM
# (light scrape - limited HTML access)
def scrape_scholarships_com():
    url = "https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type"

    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")

        links = soup.find_all("a")

        added = 0

        for link in links[:20]:
            title = link.text.strip()
            href = link.get("href")

            if not title or not href:
                continue

            full_link = href if href.startswith("http") else "https://www.scholarships.com" + href

            exists = Scholarship.query.filter_by(application_link=full_link).first()
            if exists:
                continue

            db.session.add(Scholarship(
                title=title,
                provider="Scholarships.com",
                application_link=full_link,
                description=title
            ))

            added += 1

        db.session.commit()
        return added

    except:
        return 0


# 3. SCHOLARSHIP PORTAL (basic)
def scrape_scholarship_portal():
    url = "https://www.scholarshipportal.com/scholarships"

    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")

        cards = soup.find_all("a")

        added = 0

        for card in cards[:20]:
            title = card.text.strip()
            link = card.get("href")

            if not title or not link:
                continue

            full_link = link if link.startswith("http") else "https://www.scholarshipportal.com" + link

            exists = Scholarship.query.filter_by(application_link=full_link).first()
            if exists:
                continue

            db.session.add(Scholarship(
                title=title,
                provider="ScholarshipPortal",
                application_link=full_link,
                description=title
            ))

            added += 1

        db.session.commit()
        return added

    except:
        return 0


# MASTER RUNNER

def run_all_scrapers():

    total = 0

    total += scrape_opportunity_desk()
    total += scrape_scholarships_com()
    total += scrape_scholarship_portal()

    return {
        "message": "Scraping completed",
        "total_added": total
    }