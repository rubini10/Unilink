# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

import os
import sys
# Aggiunge il percorso alla cartella radice del progetto
sys.path.insert(0, os.path.abspath('../../'))
# Aggiunge il percorso alla sottodirectory dell'app
sys.path.insert(0, os.path.abspath('../../app'))


project = 'Unilink'
copyright = '2024, Nada Mohamed & Alessia Rubini'
author = 'Nada Mohamed & Alessia Rubini'
release = 'Beta'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
]

templates_path = ['_templates']
exclude_patterns = []

autodoc_default_options = {
    'exclude-members': 'query'
}


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'alabaster'
html_static_path = ['_static']
