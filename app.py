import os
import json

from flask import flask, request, redirect
from github import Github
from dotenv import load_dotenv

TOKEN = os.getenv('GITHUB_TOKEN')
g = Github(TOKEN)
repo_name = "fgbbd/estudiandoduro"
repo = g.get_repo(repo_name)

app = __name__

@app.route('/', methods=['GET'])
def index():
    return redirect('https://estudiandoduro.vercel.app/thankyou')
    await pr()


async def pr():
    frase = request.args.get('frase')
    persona = request.args.get('persona')

    file = repo.get_contents(f"public/data/{persona}")

    frases_anteriores = json.load(file)
    frases_anteriores.append(frase)

    await create_pr(persona, frases_anteriores, frase)

async def create_pr(persona, frases, frase):
    base = repo.get_branch('main')
    repo.create_git_ref(ref="refs/heads/development", sha=base.commit.sha)
    pr_title = f"Nueva frase sugerida de {persona}"
    pr_description = f'## Nueva frase sugerida\n**Frase de {persona}: `{frase}`**'
    repo.create_pull(title=pr_title, body=pr_description, head='development', base='main')


