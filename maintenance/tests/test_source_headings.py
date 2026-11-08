import importlib.util, unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('builder',Path(__file__).resolve().parents[1]/'build_site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
class SourceHeadingTests(unittest.TestCase):
 def test_folded_plain_title(self):
  self.assertEqual(builder.source_heading('---\ntitle: Headline; A Chorus Line Still Deserves\n  Our Attention\nauthor: Robert Cushman\n---\nBody'),'Headline; A Chorus Line Still Deserves Our Attention')
 def test_quoted_colon_and_apostrophe(self):
  self.assertEqual(builder.source_heading("---\ntitle: 'Title: A writer''s\n  complete subtitle'\nauthor: Robert Cushman\n---\nBody"),"Title: A writer's complete subtitle")
 def test_double_quoted_title(self):
  self.assertEqual(builder.source_heading('---\ntitle: "Title; a \\"quoted\\"\n  subtitle"\ndate: 2008-11-01\n---'), 'Title; a "quoted" subtitle')
 def test_no_other_fields_or_body(self):
  self.assertEqual(builder.source_heading('---\ntitle: Headline\nauthor: Robert Cushman\n---\n  Body paragraph'),'Headline')
 def test_unsupported_title_is_not_guessed(self):
  for value in ['[one, two]', '{key: value}', '|', '>', '"Unclosed']:
   self.assertIsNone(builder.source_heading('---\ntitle: '+value+'\nauthor: Robert Cushman\n---'))
if __name__=='__main__':unittest.main()
