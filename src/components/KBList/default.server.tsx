import { buildNodeUrl, getChildNodes, jahiaComponent } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./component.module.css";

/** Get all child KB articles */
const getChildArticles = (node: JCRNodeWrapper) =>
  getChildNodes(node, -1, 0, (child) => child.isNodeType("jempnt:kbArticle"));

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:kbList",
    displayName: "Knowledge Base List",
  },
  ({ node }: { node?: JCRNodeWrapper }) => {
    if (!node) {
      return <div className={classes.kbList}></div>;
    }

    const title = node.hasProperty("jcr:title")
      ? node.getProperty("jcr:title").getString()
      : "IT Help & Support";
    const limit = node.hasProperty("jemp:limit")
      ? Number(node.getProperty("jemp:limit").getLong())
      : 5;

    const allArticles = getChildArticles(node);
    const articles = allArticles.slice(0, limit);

    if (articles.length === 0) {
      return <div className={classes.kbList}></div>;
    }

    return (
      <section className={classes.kbList}>
        <h2 className={classes.title}>{title}</h2>
        <ul className={classes.articles}>
          {articles.map((article) => {
            const articleTitle = article.getProperty("jcr:title").getString();
            const problem = article.hasProperty("jemp:problem")
              ? article.getProperty("jemp:problem").getString()
              : null;
            const platform = article.hasProperty("jemp:platform")
              ? article.getProperty("jemp:platform").getString()
              : null;
            const articleUrl = buildNodeUrl(article);

            return (
              <li key={article.getPath()} className={classes.article}>
                <a href={articleUrl} className={classes.articleLink}>
                  <div className={classes.articleIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <div className={classes.articleContent}>
                    <h3 className={classes.articleTitle}>{articleTitle}</h3>
                    {problem && <p className={classes.articleProblem}>{problem}</p>}
                    {platform && <span className={classes.articlePlatform}>{platform}</span>}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    );
  },
);
