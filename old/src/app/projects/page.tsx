import { H2 } from "@/components/mdx/heading";
import { Li, Ol } from "@/components/mdx/lists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import odinProjects from "./gh-projects";

export default function Projects() {
  return (
    <div className="flex max-w-article flex-col gap-24 self-center bg-base">
      {odinProjects.map((project) => (
        <Card key={project.name} className="border-none">
          <CardHeader>
            <CardTitle className="text-4xl">
              {project.name.replaceAll("-", " ")}
            </CardTitle>
            <time>{project.finishDate}</time>
            <Ol>
              <div
                role="img"
                aria-label={`preview image for project ${project.name}`}
                style={{
                  backgroundImage: `url(/projects/${project.name}.png)`,
                }}
                className="size-72 origin-center bg-cover bg-center"
              />
              <Li listType="ol">
                Live Demo:{" "}
                <a href={project.pagesUrl} className="text-green">
                  {project.pagesUrl}
                </a>
              </Li>
              <Li listType="ol">
                Github Site:{" "}
                <a href={project.repoUrl} className="text-green">
                  {project.repoUrl}
                </a>
              </Li>
            </Ol>
          </CardHeader>
          <CardContent>
            <H2 className="mt-0 text-xl">Things Learned</H2>
            <Ol>
              {project.learned.map((thingLearned) => (
                <Li key={thingLearned} listType="ol">
                  {thingLearned}
                </Li>
              ))}
            </Ol>
            <H2 className="mt-0 text-xl">Features</H2>
            <Ol>
              {project.features.map((feature) => (
                <Li key={feature} listType="ol">
                  {feature}
                </Li>
              ))}
            </Ol>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
