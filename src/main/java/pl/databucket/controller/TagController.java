package pl.databucket.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.databucket.dto.TagDto;
import pl.databucket.entity.Tag;
import pl.databucket.exception.ExceptionFormatter;
import pl.databucket.exception.ItemAlreadyExistsException;
import pl.databucket.exception.ItemNotFoundException;
import pl.databucket.exception.ModifyByNullEntityIdException;
import pl.databucket.service.TagService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/tags")
@RestController
public class TagController {

    private final ExceptionFormatter exceptionFormatter = new ExceptionFormatter(TagController.class);

    @Autowired
    private TagService tagService;

    @Autowired
    private ModelMapper modelMapper;


    @PostMapping
    public ResponseEntity<?> createTag(@Valid @RequestBody TagDto tagDto) {
        try {
            Tag tag = tagService.createTag(tagDto);
            modelMapper.map(tag, tagDto);
            return new ResponseEntity<>(tagDto, HttpStatus.CREATED);
        } catch (ItemAlreadyExistsException e) {
            return exceptionFormatter.customException(e, HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return exceptionFormatter.defaultException(e);
        }
    }

    @GetMapping
    public ResponseEntity<?> getTags() {
        try {
            List<Tag> tags = tagService.getTags();
            List<TagDto> tagsDto = tags.stream().map(item -> modelMapper.map(item, TagDto.class)).collect(Collectors.toList());
            return new ResponseEntity<>(tagsDto, HttpStatus.OK);
        } catch (Exception ee) {
            return exceptionFormatter.defaultException(ee);
        }
    }

    @PutMapping
    public ResponseEntity<?> modifyTag(@Valid @RequestBody TagDto tagDto) {
        try {
            Tag tag = tagService.modifyTag(tagDto);
            modelMapper.map(tag, tagDto);
            return new ResponseEntity<>(tagDto, HttpStatus.OK);
        } catch (ItemAlreadyExistsException e) {
            return exceptionFormatter.customException(e, HttpStatus.NOT_ACCEPTABLE);
        } catch (ItemNotFoundException | ModifyByNullEntityIdException e) {
            return exceptionFormatter.customException(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return exceptionFormatter.defaultException(e);
        }
    }

    @DeleteMapping(value = "/{tagId}")
    public ResponseEntity<?> deleteTags(@PathVariable long tagId) {
        try {
            tagService.deleteTag(tagId);
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return exceptionFormatter.defaultException(e);
        }
    }
}
